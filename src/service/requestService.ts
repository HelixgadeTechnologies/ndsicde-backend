import { PrismaClient } from "@prisma/client";
import { IDataValidationStats, IRequest, IRequestView } from "../interface/requestInterface";

const prisma = new PrismaClient();

// ✅ Create or Update Request
export const createOrUpdateRequest = async (
  payload: IRequest,
  isCreate: boolean
) => {
  if (isCreate) {
    return await prisma.request.create({
      data: {
        staff: payload.staff,
        outputId: payload.outputId,
        activityTitle: payload.activityTitle,
        activityBudgetCode: payload.activityBudgetCode,
        activityLocation: payload.activityLocation,
        activityPurposeDescription: payload.activityPurposeDescription,
        activityStartDate: payload.activityStartDate,
        activityEndDate: payload.activityEndDate,
        activityLineDescription: payload.activityLineDescription,
        quantity: payload.quantity,
        frequency: payload.frequency,
        unitCost: payload.unitCost,
        budgetCode: payload.budgetCode,
        total: payload.total,
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
        status: payload.status,
      },
    });
  } else {
    return await prisma.request.update({
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
        activityLineDescription: payload.activityLineDescription,
        quantity: payload.quantity,
        frequency: payload.frequency,
        unitCost: payload.unitCost,
        budgetCode: payload.budgetCode,
        total: payload.total,
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
        status: payload.status,
        updateAt: new Date(),
      },
    });
  }
};

// ✅ Get all Requests (from view)
export const getAllRequests = async (): Promise<IRequestView[]> => {
  return await prisma.$queryRaw<IRequestView[]>`
    SELECT * FROM request_view
  `;
};

// ✅ Get Request by ID (from view)
export const getRequestById = async (
  requestId: string
): Promise<IRequestView | null> => {
  const result = await prisma.$queryRaw<IRequestView[]>`
    SELECT * FROM request_view WHERE "requestId" = ${requestId}
  `;
  return result.length > 0 ? result[0] : null;
};

// ✅ Delete Request
export const deleteRequest = async (requestId: string) => {
  return await prisma.request.delete({
    where: { requestId },
  });
};

// ✅ Request Approval with Auto-Level Detection
export const requestApproval = async (
  requestId: string,
  approvalStatus: number,
  approvedBy: string,
  comment?: string
) => {
  try {
    // Fetch the request
    const request = await prisma.request.findUnique({ where: { requestId } });

    if (!request) {
      throw new Error("Request not found");
    }

    // Determine the next approval level based on existing approvals
    const approvalLevels: Array<"A" | "B" | "C" | "D" | "E"> = ["A", "B", "C", "D", "E"];
    let currentLevel: "A" | "B" | "C" | "D" | "E" | null = null;

    for (const level of approvalLevels) {
      const approvalField = `approval_${level}` as keyof typeof request;
      if (request[approvalField] === null || request[approvalField] === undefined) {
        currentLevel = level;
        break;
      }
    }

    if (!currentLevel) {
      throw new Error("All approval levels have already been processed");
    }

    // Validate sequential approval (ensure previous levels are approved)
    const levelIndex = approvalLevels.indexOf(currentLevel);
    if (levelIndex > 0) {
      const previousLevel = approvalLevels[levelIndex - 1];
      const previousApprovalField = `approval_${previousLevel}` as keyof typeof request;
      if (request[previousApprovalField] !== 1) {
        throw new Error(
          `Cannot approve at level ${currentLevel}. Previous level ${previousLevel} must be approved first.`
        );
      }
    }

    // Determine the new status based on approval/rejection
    let newStatus = request.status;
    if (approvalStatus === 2) {
      // Rejection
      newStatus = "Rejected";
    } else if (approvalStatus === 1 && currentLevel === "E") {
      // Final approval
      newStatus = "Approved";
    } else if (approvalStatus === 1) {
      // Intermediate approval
      newStatus = "Pending";
    }

    // Build the update data dynamically
    const updateData: any = {
      [`approval_${currentLevel}`]: approvalStatus,
      [`approvedBy_${currentLevel}`]: approvedBy,
      [`comment_${currentLevel}`]: comment || null,
      status: newStatus,
      updateAt: new Date(),
    };

    // Update the request
    const updatedRequest = await prisma.request.update({
      where: { requestId },
      data: updateData,
    });

    return updatedRequest;
  } catch (error) {
    console.log(error);
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
