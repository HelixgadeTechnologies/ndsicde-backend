import { IDataValidationStats, ILineItem, IOtherPersonnel, IRequest, IRequestView } from "../interface/requestInterface";
import { prisma } from "../lib/prisma";

const JOURNEY_FIELDS = (payload: IRequest) => ({
  isJourneyManagementRequired:           payload.isJourneyManagementRequired ?? false,
  purposeOfTrip:                         payload.purposeOfTrip,
  vehicleMake:                           payload.vehicleMake,
  vehicleModel:                          payload.vehicleModel,
  departureDate:                         payload.departureDate,
  departureLocationAndTime:              payload.departureLocationAndTime,
  destination:                           payload.destination,
  contactPersonPhoneNumberAtDestination: payload.contactPersonPhoneNumberAtDestination,
  flightDepartureState:                  payload.flightDepartureState,
  flightDepartureTime:                   payload.flightDepartureTime,
  flightArrivalState:                    payload.flightArrivalState,
  flightArrivalTime:                     payload.flightArrivalTime,
  hotelAccommodationName:                payload.hotelAccommodationName,
  hotelAddress:                          payload.hotelAddress,
  returnDate:                            payload.returnDate,
  returnTime:                            payload.returnTime,
  airportDropoffOfficerName:             payload.airportDropoffOfficerName,
  airportPickupOfficerName:              payload.airportPickupOfficerName,
  budgetName:                            payload.budgetName,
});

// ✅ Create or Update Request (with LineItems and OtherPersonnel)
export const createOrUpdateRequest = async (
  payload: IRequest,
  isCreate: boolean
) => {
  const lineItems: ILineItem[]         = payload.lineItems       || [];
  const otherPersonnel: IOtherPersonnel[] = payload.otherPersonnel || [];

  if (isCreate) {
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
          ...JOURNEY_FIELDS(payload),
        },
      });

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
            variance: null,
            activityId: item.activityId || null,
          })),
        });
      }

      if (otherPersonnel.length > 0) {
        await tx.otherPersonnel.createMany({
          data: otherPersonnel.map((p) => ({
            requestId: newRequest.requestId,
            name:        p.name        || null,
            company:     p.company     || null,
            phoneNumber: p.phoneNumber || null,
          })),
        });
      }

      return await tx.request.findUnique({
        where: { requestId: newRequest.requestId },
        include: { lineItems: true, otherPersonnel: true },
      });
    });
  } else {
    if (!payload.requestId) throw new Error("requestId is required for update");

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
          ...JOURNEY_FIELDS(payload),
        },
      });

      // Replace line items
      await tx.lineItem.deleteMany({ where: { requestId: payload.requestId } });
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
            activityId: item.activityId || null,
          })),
        });
      }

      // Replace otherPersonnel
      await tx.otherPersonnel.deleteMany({ where: { requestId: payload.requestId } });
      if (otherPersonnel.length > 0) {
        await tx.otherPersonnel.createMany({
          data: otherPersonnel.map((p) => ({
            requestId: payload.requestId!,
            name:        p.name        || null,
            company:     p.company     || null,
            phoneNumber: p.phoneNumber || null,
          })),
        });
      }

      return await tx.request.findUnique({
        where: { requestId: payload.requestId },
        include: { lineItems: true, otherPersonnel: true },
      });
    });
  }
};


// ✅ Get all Requests (from view) — with line items and otherPersonnel
export const getAllRequests = async (): Promise<IRequestView[]> => {
  const requests = await prisma.$queryRaw<IRequestView[]>`
    SELECT * FROM request_view
  `;

  if (requests.length === 0) return [];

  const requestIds = requests.map((r) => r.requestId);

  const [allLineItems, allOtherPersonnel] = await Promise.all([
    prisma.lineItem.findMany({ where: { requestId: { in: requestIds } } }),
    prisma.otherPersonnel.findMany({ where: { requestId: { in: requestIds } } }),
  ]);

  return requests.map((r) => ({
    ...r,
    lineItems:      allLineItems.filter((li) => li.requestId === r.requestId),
    otherPersonnel: allOtherPersonnel.filter((p) => p.requestId === r.requestId),
  }));
};

// ✅ Get Request by ID (from view) — with line items and otherPersonnel
export const getRequestById = async (
  requestId: string
): Promise<IRequestView | null> => {
  const result = await prisma.$queryRaw<IRequestView[]>`
    SELECT * FROM request_view WHERE requestId = ${requestId}
  `;

  if (result.length === 0) return null;

  const [lineItems, otherPersonnel] = await Promise.all([
    prisma.lineItem.findMany({ where: { requestId } }),
    prisma.otherPersonnel.findMany({ where: { requestId } }),
  ]);

  return { ...result[0], lineItems, otherPersonnel };
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

type ApprovalLevel = "A" | "B" | "C" | "D" | "E";

// All possible columns — used when clearing fields on review reset
const ALL_LEVELS: ApprovalLevel[] = ["A", "B", "C", "D", "E"];

// Absolute position of each level — used for approvalStep regardless of skips
const LEVEL_NUMBER: Record<ApprovalLevel, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5,
};

export const requestApproval = async (
  requestId: string,
  approvalStatus: number,
  approvedBy: string,
  comment?: string
) => {
  try {
    const request = await prisma.request.findUnique({ where: { requestId } });

    if (!request) throw new Error("Request not found");

    // Level B (Journey Management) is skipped when isJourneyManagementRequired = true
    const activeLevels: ApprovalLevel[] = request.isJourneyManagementRequired
      ? ["A", "C", "D", "E"]
      : ["A", "B", "C", "D", "E"];

    // Detect the first unset active level
    let currentLevel: ApprovalLevel | null = null;
    for (const level of activeLevels) {
      const field = `approval_${level}` as keyof typeof request;
      if (request[field] === null || request[field] === undefined) {
        currentLevel = level;
        break;
      }
    }

    if (!currentLevel) throw new Error("All approval levels already processed");

    const levelIndex = activeLevels.indexOf(currentLevel);

    // Ensure the previous active level is approved before proceeding
    if (levelIndex > 0) {
      const prevLevel = activeLevels[levelIndex - 1];
      const prevField = `approval_${prevLevel}` as keyof typeof request;
      if (request[prevField] !== ApprovalStatus.APPROVED) {
        throw new Error(`Previous level ${prevLevel} must be approved first`);
      }
    }

    const isFinalLevel = currentLevel === activeLevels[activeLevels.length - 1];

    // =====================================
    // 🔁 HANDLE REVIEW (SMART RESET)
    // =====================================
    if (approvalStatus === ApprovalStatus.REVIEW) {
      const resetData: any = {
        status:       "InReview",
        approvalStep: 0,
        updateAt:     new Date(),
      };

      for (const level of ALL_LEVELS) {
        if (level === currentLevel) {
          resetData[`approval_${level}`]   = ApprovalStatus.REVIEW;
          resetData[`approvedBy_${level}`] = approvedBy;
          resetData[`comment_${level}`]    = comment || null;
        } else {
          resetData[`approval_${level}`]   = null;
          resetData[`approvedBy_${level}`] = null;
          resetData[`comment_${level}`]    = null;
        }
      }

      return await prisma.request.update({ where: { requestId }, data: resetData });
    }

    // =====================================
    // ❌ HANDLE REJECTION
    // =====================================
    if (approvalStatus === ApprovalStatus.REJECTED) {
      return await prisma.request.update({
        where: { requestId },
        data: {
          [`approval_${currentLevel}`]:   ApprovalStatus.REJECTED,
          [`approvedBy_${currentLevel}`]: approvedBy,
          [`comment_${currentLevel}`]:    comment || null,
          approvalStep: LEVEL_NUMBER[currentLevel],
          status:       "Rejected",
          updateAt:     new Date(),
        },
      });
    }

    // =====================================
    // ✅ HANDLE APPROVAL
    // =====================================
    if (approvalStatus === ApprovalStatus.APPROVED) {
      return await prisma.request.update({
        where: { requestId },
        data: {
          [`approval_${currentLevel}`]:   ApprovalStatus.APPROVED,
          [`approvedBy_${currentLevel}`]: approvedBy,
          [`comment_${currentLevel}`]:    comment || null,
          approvalStep: LEVEL_NUMBER[currentLevel],
          status:       isFinalLevel ? "Approved" : "InReview",
          updateAt:     new Date(),
        },
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
        retirement: {
            select: {
                retirementId: true,
                activityLineDescription: true,
                quantity: true,
                frequency: true,
                unitCost: true,
                actualCost: true,
                totalBudget: true,
                documentName: true,
                documentURL: true,
                approval_A: true,
                approval_B: true,
                approval_C: true,
                approvedBy_A: true,
                approvedBy_B: true,
                approvedBy_C: true,
                comment_A: true,
                comment_B: true,
                comment_C: true,
                approvalStep: true,
                requestId: true,
                needJournalId: true,
                journalId: true,
                status: true,
                createAt: true,
                updateAt: true,
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
