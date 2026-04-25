import { IRetirement, IRetirementView } from "../interface/retirementInterface";
import { ILineItem } from "../interface/requestInterface";
import { prisma } from "../lib/prisma";

// ✅ Create or Update Retirement (with LineItems)
export const createOrUpdateRetirement = async (
  payload: IRetirement,
  isCreate: boolean
) => {
  const lineItems: ILineItem[] = payload.lineItems || [];

  if (isCreate) {
    return await prisma.$transaction(async (tx) => {
      // 1️⃣ Create the retirement record
      const newRetirement = await tx.retirement.create({
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
          status: payload.status ?? "Pending",
        },
      });

      // 2️⃣ Upsert each line item (update totalSpent & variance on existing rows)
      if (lineItems.length > 0 && payload.requestId) {
        for (const item of lineItems) {
          if (item.lineItemId) {
            // Update existing line item
            await tx.lineItem.update({
              where: { lineItemId: item.lineItemId },
              data: {
                totalSpent: item.totalSpent ?? null,
                variance: item.variance ?? null,
                updateAt: new Date(),
              },
            });
          } else {
            // Create a new line item linked to the request
            await tx.lineItem.create({
              data: {
                requestId: payload.requestId!,
                description: item.description ?? null,
                quantity: item.quantity ?? null,
                frequency: item.frequency ?? null,
                unitCost: item.unitCost ?? null,
                totalBudget: item.totalBudget ?? null,
                totalSpent: item.totalSpent ?? null,
                variance: item.variance ?? null,
              },
            });
          }
        }
      }

      // 3️⃣ Return retirement + updated line items
      const updatedLineItems = payload.requestId
        ? await tx.lineItem.findMany({ where: { requestId: payload.requestId } })
        : [];

      return { ...newRetirement, lineItems: updatedLineItems };
    });
  } else {
    if (!payload.retirementId) {
      throw new Error("retirementId is required for update");
    }

    return await prisma.$transaction(async (tx) => {
      // 1️⃣ Update the retirement record
      const updatedRetirement = await tx.retirement.update({
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

      // 2️⃣ Upsert each line item (update totalSpent & variance on existing rows)
      if (lineItems.length > 0 && payload.requestId) {
        for (const item of lineItems) {
          if (item.lineItemId) {
            // Update existing line item
            await tx.lineItem.update({
              where: { lineItemId: item.lineItemId },
              data: {
                totalSpent: item.totalSpent ?? null,
                variance: item.variance ?? null,
                updateAt: new Date(),
              },
            });
          } else {
            // Create a new line item linked to the request
            await tx.lineItem.create({
              data: {
                requestId: payload.requestId!,
                description: item.description ?? null,
                quantity: item.quantity ?? null,
                frequency: item.frequency ?? null,
                unitCost: item.unitCost ?? null,
                totalBudget: item.totalBudget ?? null,
                totalSpent: item.totalSpent ?? null,
                variance: item.variance ?? null,
              },
            });
          }
        }
      }

      // 3️⃣ Return retirement + updated line items
      const updatedLineItems = payload.requestId
        ? await tx.lineItem.findMany({ where: { requestId: payload.requestId } })
        : [];

      return { ...updatedRetirement, lineItems: updatedLineItems };
    });
  }
};

// ✅ Get All Retirements (from view)
export const getAllRetirements = async (): Promise<IRetirementView[]> => {
  const retirements = await prisma.$queryRaw<IRetirementView[]>`
    SELECT * FROM retirement_view
  `;

  // Attach line items for each retirement via requestId
  const enriched = await Promise.all(
    retirements.map(async (retirement) => {
      const lineItems = retirement.requestId
        ? await prisma.lineItem.findMany({ where: { requestId: retirement.requestId } })
        : [];
      return { ...retirement, lineItems };
    })
  );

  return enriched;
};

// ✅ Get Retirement by ID (from view)
export const getRetirementById = async (
  retirementId: string
): Promise<IRetirementView | null> => {
  const result = await prisma.$queryRaw<IRetirementView[]>`
    SELECT * FROM retirement_view WHERE retirementId = ${retirementId}
  `;

  if (result.length === 0) return null;

  const retirement = result[0];

  // Attach line items via requestId
  const lineItems = retirement.requestId
    ? await prisma.lineItem.findMany({ where: { requestId: retirement.requestId } })
    : [];

  return { ...retirement, lineItems };
};

// get retirement by project id
export const getRetirementByProjectId = async (
  projectId: string
): Promise<IRetirementView[] | null> => {
  const rows: IRetirementView[] = await prisma.$queryRaw`
    SELECT * FROM retirement_view WHERE "projectId" = ${projectId}
  `;
  if (rows.length === 0) return null;

  // Map over each retirement and attach line items via requestId
  const retirementsWithLineItems = await Promise.all(
    rows.map(async (retirement) => {
      const lineItems = retirement.requestId
        ? await prisma.lineItem.findMany({
            where: { requestId: retirement.requestId },
          })
        : [];
      return { ...retirement, lineItems };
    })
  );

  return retirementsWithLineItems;
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