import { IRetirement, IRetirementView } from "../interface/retirementInterface";
import { prisma } from "../lib/prisma";

// ✅ Create or Update Retirement
export const createOrUpdateRetirement = async (
  payload: IRetirement,
  isCreate: boolean
) => {
  if (isCreate) {
    return await prisma.retirement.create({
      data: {
        activityLineDescription: payload.activityLineDescription,
        quantity: payload.quantity,
        frequency: payload.frequency,
        unitCost: payload.unitCost,
        actualCost: payload.actualCost,
        totalBudget: payload.totalBudget,
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
        activityLineDescription: payload.activityLineDescription,
        quantity: payload.quantity,
        frequency: payload.frequency,
        unitCost: payload.unitCost,
        actualCost: payload.actualCost,
        totalBudget: payload.totalBudget,
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
    SELECT * FROM retirement_view WHERE retirementId = ${retirementId}
  `;
  return result.length > 0 ? result[0] : null;
};

// ✅ Delete Retirement
export const deleteRetirement = async (retirementId: string) => {
  return await prisma.retirement.delete({
    where: { retirementId },
  });
};

export enum ApprovalStatus {
  APPROVED = 1,
  REJECTED = 2,
  REVIEW = 3,
}

export const approveRetirement = async (
  retirementId: string,
  approvalStatus: number,
  approvedBy: string,
  comment?: string
) => {
  try {
    const retirement = await prisma.retirement.findUnique({
      where: { retirementId },
    });

    if (!retirement) {
      throw new Error("Retirement not found");
    }

    const approvalLevels: Array<"A" | "B" | "C"> = ["A", "B", "C"];

    const levelMap = {
      A: 1,
      B: 2,
      C: 3,
    };

    // 🔎 Detect current level
    let currentLevel: "A" | "B" | "C" | null = null;

    for (const level of approvalLevels) {
      const field = `approval_${level}` as keyof typeof retirement;

      if (retirement[field] === null || retirement[field] === undefined) {
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
      const prevField = `approval_${prevLevel}` as keyof typeof retirement;

      if (retirement[prevField] !== ApprovalStatus.APPROVED) {
        throw new Error(
          `Previous level ${prevLevel} must be approved first`
        );
      }
    }

    // =====================================
    // 🔁 REVIEW (SMART RESET)
    // =====================================
    if (approvalStatus === ApprovalStatus.REVIEW) {
      const resetData: any = {
        status: "Under Review",
        updateAt: new Date(),
      };

      for (const level of approvalLevels) {
        if (level === currentLevel) {
          // ✅ Keep this level
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

      return await prisma.retirement.update({
        where: { retirementId },
        data: resetData,
      });
    }

    // =====================================
    // ❌ REJECTION
    // =====================================
    if (approvalStatus === ApprovalStatus.REJECTED) {
      return await prisma.retirement.update({
        where: { retirementId },
        data: {
          [`approval_${currentLevel}`]: ApprovalStatus.REJECTED,
          [`approvedBy_${currentLevel}`]: approvedBy,
          [`comment_${currentLevel}`]: comment || null,
          status: "Rejected",
          updateAt: new Date(),
        },
      });
    }

    // =====================================
    // ✅ APPROVAL
    // =====================================
    if (approvalStatus === ApprovalStatus.APPROVED) {
      const isFinalLevel = currentLevel === "C";

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

      return await prisma.retirement.update({
        where: { retirementId },
        data: updateData,
      });
    }

    throw new Error("Invalid approval status");
  } catch (error) {
    console.error("Retirement Approval Error:", error);
    throw error;
  }
};