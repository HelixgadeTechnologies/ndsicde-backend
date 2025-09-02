import { PrismaClient } from "@prisma/client";
import { IRequest, IRequestView } from "../interface/requestInterface";

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