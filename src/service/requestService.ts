import { IDataValidationStats, ILineItem, IRequest, IRequestView } from "../interface/requestInterface";
import { prisma } from "../lib/prisma";

// ✅ Create or Update Request (with LineItems saved to lineitem table)
export const createOrUpdateRequest = async (
  payload: IRequest,
  isCreate: boolean
) => {
  const lineItems: ILineItem[] = payload.lineItems || [];

  if (isCreate) {
    // 🔀 Use a transaction to create request + line items atomically
    return await prisma.$transaction(async (tx) => {
      const newRequest = await tx.request.create({
        data: {
          staff: payload.staff,
          outputId: payload.outputId,
          activityTitle: payload.activityTitle,
          activityBudgetCode: payload.activityBudgetCode,
          activityLocation: payload.activityLocation,
          activityPurposeDescription: payload.activityPurposeDescription,
          activityStartDate: payload.activityStartDate,
          activityEndDate: payload.activityEndDate,
          budgetCode: payload.budgetCode,
          modeOfTransport: payload.modeOfTransport,
          driverName: payload.driverName,
          driversPhoneNumber: payload.driversPhoneNumber,
          vehiclePlateNumber: payload.vehiclePlateNumber,
          vehicleColor: payload.vehicleColor,
          departureTime: payload.departureTime,
          route: payload.route,
          recipientPhoneNumber: payload.recipientPhoneNumber,
          documentName: payload.documentName,
          documentURL: payload.documentURL,
          projectId: payload.projectId,
          createdBy: payload.createdBy,
          status: payload.status ?? "Pending",
        },
      });

      // ✅ Save each line item linked to the new request
      if (lineItems.length > 0) {
        await tx.lineItem.createMany({
          data: lineItems.map((item) => ({
            requestId: newRequest.requestId,
            description: item.description,
            quantity: item.quantity,
            frequency: item.frequency,
            unitCost: item.unitCost,
            totalBudget: item.totalBudget,
            totalSpent: null,
            variance: null
          })),
        });
      }

      // Return request with its line items
      return await tx.request.findUnique({
        where: { requestId: newRequest.requestId },
        include: { lineItems: true },
      });
    });
  } else {
    if (!payload.requestId) {
      throw new Error("requestId is required for update");
    }

    // 🔀 Transaction: update request + replace all line items
    return await prisma.$transaction(async (tx) => {
      await tx.request.update({
        where: { requestId: payload.requestId },
        data: {
          staff: payload.staff,
          outputId: payload.outputId,
          activityTitle: payload.activityTitle,
          activityBudgetCode: payload.activityBudgetCode,
          activityLocation: payload.activityLocation,
          activityPurposeDescription: payload.activityPurposeDescription,
          activityStartDate: payload.activityStartDate,
          activityEndDate: payload.activityEndDate,
          budgetCode: payload.budgetCode,
          modeOfTransport: payload.modeOfTransport,
          driverName: payload.driverName,
          driversPhoneNumber: payload.driversPhoneNumber,
          vehiclePlateNumber: payload.vehiclePlateNumber,
          vehicleColor: payload.vehicleColor,
          departureTime: payload.departureTime,
          route: payload.route,
          recipientPhoneNumber: payload.recipientPhoneNumber,
          documentName: payload.documentName,
          documentURL: payload.documentURL,
          projectId: payload.projectId,
          createdBy: payload.createdBy,
          status: payload.status,
          updateAt: new Date(),
        },
      });

      // ✅ Replace line items: delete old ones and re-insert
      await tx.lineItem.deleteMany({
        where: { requestId: payload.requestId },
      });

      if (lineItems.length > 0) {
        await tx.lineItem.createMany({
          data: lineItems.map((item) => ({
            requestId: payload.requestId!,
            description: item.description,
            quantity: item.quantity,
            frequency: item.frequency,
            unitCost: item.unitCost,
            totalBudget: item.totalBudget,
            totalSpent: null,
            variance: null,
          })),
        });
      }

      // Return updated request with its line items
      return await tx.request.findUnique({
        where: { requestId: payload.requestId },
        include: { lineItems: true },
      });
    });
  }
};


// ✅ Get all Requests (from view) — with line items
export const getAllRequests = async (): Promise<IRequestView[]> => {
  const requests = await prisma.$queryRaw<IRequestView[]>`
    SELECT * FROM request_view
  `;

  if (requests.length === 0) return [];

  // Fetch all line items in one query and group by requestId
  const requestIds = requests.map((r) => r.requestId);
  const allLineItems = await prisma.lineItem.findMany({
    where: { requestId: { in: requestIds } },
  });

  // Attach line items to their parent request
  return requests.map((r) => ({
    ...r,
    lineItems: allLineItems.filter((li) => li.requestId === r.requestId),
  }));
};

// ✅ Get Request by ID (from view) — with line items
export const getRequestById = async (
  requestId: string
): Promise<IRequestView | null> => {
  const result = await prisma.$queryRaw<IRequestView[]>`
    SELECT * FROM request_view WHERE requestId = ${requestId}
  `;

  if (result.length === 0) return null;

  const lineItems = await prisma.lineItem.findMany({
    where: { requestId },
  });

  return { ...result[0], lineItems };
};


// ✅ Delete Request
export const deleteRequest = async (requestId: string) => {
  return await prisma.request.delete({
    where: { requestId },
  });
};

export enum ApprovalStatus {
  APPROVED = 1,
  REJECTED = 2,
  REVIEW = 3,
}

export const requestApproval = async (
  requestId: string,
  approvalStatus: number,
  approvedBy: string,
  comment?: string
) => {
  try {
    const request = await prisma.request.findUnique({
      where: { requestId },
    });

    if (!request) {
      throw new Error("Request not found");
    }

    const approvalLevels: Array<"A" | "B" | "C" | "D"> = ["A", "B", "C", "D"];
    const levelMap = {
      A: 1,
      B: 2,
      C: 3,
      D: 4,
    };

    // 🔎 Detect current level
    let currentLevel: "A" | "B" | "C" | "D" | null = null;

    for (const level of approvalLevels) {
      const field = `approval_${level}` as keyof typeof request;

      if (request[field] === null || request[field] === undefined) {
        currentLevel = level;
        break;
      }
    }

    if (!currentLevel) {
      throw new Error("All approval levels already processed");
    }

    const levelIndex = approvalLevels.indexOf(currentLevel);

    // 🔒 Ensure previous level is approved
    if (levelIndex > 0) {
      const prevLevel = approvalLevels[levelIndex - 1];
      const prevField = `approval_${prevLevel}` as keyof typeof request;

      if (request[prevField] !== ApprovalStatus.APPROVED) {
        throw new Error(
          `Previous level ${prevLevel} must be approved first`
        );
      }
    }

    // =====================================
    // 🔁 HANDLE REVIEW (SMART RESET)
    // =====================================
    if (approvalStatus === ApprovalStatus.REVIEW) {
      const resetData: any = {
        status: "Under Review",
        updateAt: new Date(),
      };

      // Loop through all levels
      for (const level of approvalLevels) {
        if (level === currentLevel) {
          // ✅ Keep this level's info
          resetData[`approval_${level}`] = ApprovalStatus.REVIEW;
          resetData[`approvedBy_${level}`] = approvedBy;
          resetData[`comment_${level}`] = comment || null;
        } else {
          // ❌ Clear others
          resetData[`approval_${level}`] = null;
          resetData[`approvedBy_${level}`] = null;
          resetData[`comment_${level}`] = null;
        }
      }

      const updated = await prisma.request.update({
        where: { requestId },
        data: resetData,
      });

      return updated;
    }

    // =====================================
    // ❌ HANDLE REJECTION
    // =====================================
    if (approvalStatus === ApprovalStatus.REJECTED) {
      const updateData: any = {
        [`approval_${currentLevel}`]: ApprovalStatus.REJECTED,
        [`approvedBy_${currentLevel}`]: approvedBy,
        [`comment_${currentLevel}`]: comment || null,
        status: "Rejected",
        updateAt: new Date(),
      };

      return await prisma.request.update({
        where: { requestId },
        data: updateData,
      });
    }

    // =====================================
    // ✅ HANDLE APPROVAL
    // =====================================
    if (approvalStatus === ApprovalStatus.APPROVED) {
      const isFinalLevel = currentLevel === "D";

      const updateData: any = {
        [`approval_${currentLevel}`]: ApprovalStatus.APPROVED,
        [`approvedBy_${currentLevel}`]: approvedBy,
        [`comment_${currentLevel}`]: comment || null,
        updateAt: new Date(),
      };

      if (isFinalLevel) {
        updateData.status = "Approved";
      } else {
        updateData.status = `Layer ${levelMap[currentLevel]} Approved`;
      }

      return await prisma.request.update({
        where: { requestId },
        data: updateData,
      });
    }

    throw new Error("Invalid approval status");
  } catch (error) {
    console.error("Approval Error:", error);
    throw error;
  }
};

// ✅ Get Data Validation Statistics
export const getDataValidationStats = async (
  startDate?: string,
  endDate?: string,
  projectId?: string
): Promise<IDataValidationStats> => {
  try {
    const commonFilter: any = {};

    if (startDate || endDate) {
      commonFilter.createAt = {};
      if (startDate) commonFilter.createAt.gte = new Date(startDate);
      if (endDate) commonFilter.createAt.lte = new Date(endDate);
    }

    if (projectId) {
      commonFilter.projectId = projectId;
    }

    // Get current period statistics
    const totalSubmissions = await prisma.request.count({
      where: commonFilter,
    });

    const pendingReview = await prisma.request.count({
      where: { ...commonFilter, status: "Pending" },
    });

    const approved = await prisma.request.count({
      where: { ...commonFilter, status: "Approved" },
    });

    const rejected = await prisma.request.count({
      where: { ...commonFilter, status: "Rejected" },
    });

    const retirementFilter: any = {
      ...(startDate || endDate ? {
        createAt: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && { lte: new Date(endDate) }),
        }
      } : {}),
    };

    if (projectId) {
      retirementFilter.request = { projectId };
    }

    const approvedRetirements = await prisma.retirement.count({
      where: {
        ...retirementFilter,
        status: "Approved",
      },
    });

    const totalRetirement = await prisma.retirement.count({
      where: retirementFilter,
    });

    // Calculate previous period for comparison
    let percentageFromLastMonth = 0;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const duration = end.getTime() - start.getTime();

      const previousStart = new Date(start.getTime() - duration);
      const previousEnd = start;

      const previousSubmissions = await prisma.request.count({
        where: {
          createAt: {
            gte: previousStart,
            lt: previousEnd,
          },
          ...(projectId && { projectId }),
        },
      });

      if (previousSubmissions > 0) {
        percentageFromLastMonth =
          ((totalSubmissions - previousSubmissions) / previousSubmissions) * 100;
      }
    }

    // Calculate rates
    const approvalRate = totalSubmissions > 0
      ? (approved / totalSubmissions) * 100
      : 0;

    const rejectionRate = totalSubmissions > 0
      ? (rejected / totalSubmissions) * 100
      : 0;

    return {
      totalSubmissions,
      pendingReview,
      approved,
      rejected,
      pendingFinancialRequests: pendingReview, // Same as pending review
      approvedRetirements,
      totalRetirement,
      percentageFromLastMonth: Number(percentageFromLastMonth.toFixed(2)),
      approvalRate: Number(approvalRate.toFixed(2)),
      rejectionRate: Number(rejectionRate.toFixed(2)),
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// ✅ Get Requests with Date Range Filter
export const getRequestsWithDateFilter = async (
  startDate?: string,
  endDate?: string
) => {
  try {
    const dateFilter: any = {};

    if (startDate || endDate) {
      dateFilter.createAt = {};
      if (startDate) dateFilter.createAt.gte = new Date(startDate);
      if (endDate) dateFilter.createAt.lte = new Date(endDate);
    }

    const requests = await prisma.request.findMany({
      where: dateFilter,
      include: {
        project: {
          select: {
            projectName: true,
          },
        },
        lineItems: true,
      },
      orderBy: {
        createAt: 'desc',
      },
    });

    return requests;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// ✅ Get Requests by Project ID
export const getRequestsByProjectId = async (projectId: string) => {
  try {
    const requests = await prisma.request.findMany({
      where: { projectId },
      include: {
        project: {
          select: {
            projectName: true,
          },
        },
        retirement: true,
        lineItems: true,
      },
      orderBy: {
        createAt: 'desc',
      },
    });

    return requests;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
