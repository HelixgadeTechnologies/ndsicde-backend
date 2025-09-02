import { PrismaClient } from "@prisma/client";
import { IRetirement, IRetirementView } from "../interface/retirementInterface";

const prisma = new PrismaClient();

// ✅ Create or Update Retirement
export const createOrUpdateRetirement = async (
  payload: IRetirement,
  isCreate: boolean
) => {
  if (isCreate) {
    return await prisma.retirement.create({
      data: {
        lineItem: payload.lineItem,
        actualCostOfLineItem: payload.actualCostOfLineItem,
        documentName: payload.documentName,
        documentURL: payload.documentURL,
        requestId: payload.requestId,
        status: payload.status,
      },
    });
  } else {
    if (!payload.retirementId) {
      throw new Error("retirementId is required for update");
    }
    return await prisma.retirement.update({
      where: { retirementId: payload.retirementId },
      data: {
        lineItem: payload.lineItem,
        actualCostOfLineItem: payload.actualCostOfLineItem,
        documentName: payload.documentName,
        documentURL: payload.documentURL,
        requestId: payload.requestId,
        status: payload.status,
        updateAt: new Date(),
      },
    });
  }
};

// ✅ Get All Retirements (from view)
export const getAllRetirements = async (): Promise<IRetirementView[]> => {
  return await prisma.$queryRaw<IRetirementView[]>`
    SELECT * FROM retirement_view
  `;
};

// ✅ Get Retirement by ID (from view)
export const getRetirementById = async (
  retirementId: string
): Promise<IRetirementView | null> => {
  const result = await prisma.$queryRaw<IRetirementView[]>`
    SELECT * FROM retirement_view WHERE "retirementId" = ${retirementId}
  `;
  return result.length > 0 ? result[0] : null;
};

// ✅ Delete Retirement
export const deleteRetirement = async (retirementId: string) => {
  return await prisma.retirement.delete({
    where: { retirementId },
  });
};
