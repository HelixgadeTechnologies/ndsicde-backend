import { Prisma, PrismaClient } from "@prisma/client";
import {
  IKpi,
  IStrategicObjective,
  IStrategicObjectiveView,
} from "../interface/strategicObjectiveAndKpiInterface";
const prisma = new PrismaClient();

export const saveStrategicObjective = async (
  data: IStrategicObjective,
  isCreate: boolean
) => {
  try {
    if (isCreate) {
      return await prisma.strategicObjective.create({
        data: {
          statement: data.statement ?? null,
          thematicAreas: data.thematicAreas ?? null,
          pillarLead: data.pillarLead ?? null,
          status: data.status ?? null,
        },
      });
    }

    return await prisma.strategicObjective.update({
      where: { strategicObjectiveId: data.strategicObjectiveId },
      data: {
        statement: data.statement ?? null,
        thematicAreas: data.thematicAreas ?? null,
        pillarLead: data.pillarLead ?? null,
        status: data.status ?? null,
        updateAt: new Date(),
      },
    });

  } catch (error: any) {
    // console.error("Error saving strategic objective:", error);
    throw error;
  }
};

export const deleteStrategicObjective = async (
  strategicObjectiveId: string
) => {
  return await prisma.$transaction(async (tx) => {
    // Step 1: Find all KPIs linked to this strategic objective
    const kpis = await tx.kpi.findMany({
      where: { strategicObjectiveId },
      select: { kpiId: true },
    });
    const kpiIds = kpis.map((k) => k.kpiId);

    // Step 2: Find KpiReports linked directly to this strategic objective
    const kpiReports = await tx.kpiReport.findMany({
      where: { strategicObjectiveId },
      select: { kpiReportId: true },
    });
    const kpiReportIds = kpiReports.map((r) => r.kpiReportId);

    // Step 3: Delete KpiReviews for those KpiReports
    if (kpiReportIds.length > 0) {
      await tx.kpiReview.deleteMany({
        where: { kpiReportId: { in: kpiReportIds } },
      });

      // Step 4: Delete KpiReports
      await tx.kpiReport.deleteMany({
        where: { strategicObjectiveId },
      });
    }

    if (kpiIds.length > 0) {
      // Step 5: Delete KpiAssignments
      await tx.kpiAssignment.deleteMany({
        where: { kpiId: { in: kpiIds } },
      });

      // Step 6: Delete the KPIs
      await tx.kpi.deleteMany({
        where: { strategicObjectiveId },
      });
    }

    // Step 7: Nullify strategicObjectiveId on linked Projects (don't delete them)
    await tx.project.updateMany({
      where: { strategicObjectiveId },
      data: { strategicObjectiveId: null },
    });

    // Step 8: Delete the strategic objective
    return await tx.strategicObjective.delete({
      where: { strategicObjectiveId },
    });
  });
};

export const getAllStrategicObjectives = async () => {
  try {
    const strategicObjectivesWithCount: Array<IStrategicObjectiveView> =
      await prisma.$queryRaw`
    SELECT * FROM strategic_objective_view
  `;

    // Convert BigInt values to numbers for JSON serialization
    const result = strategicObjectivesWithCount.map((obj: any) => ({
      ...obj,
      linkedKpi: obj.linkedKpi ? Number(obj.linkedKpi) : 0,
    }));

    // console.log(result);
    return result;
  } catch (error: any) {
    // console.error("Error fetching strategic objectives:", error);
    throw error;
  }
};

export const getStrategicObjectiveById = async (id: string) => {
  return await prisma.strategicObjective.findUnique({
    where: { strategicObjectiveId: id },
  });
};

export const saveKpi = async (data: IKpi, isCreate: boolean) => {
  if (isCreate) {
    return prisma.kpi.create({
      data: {
        statement: data.statement ?? null,
        definition: data.definition ?? null,
        type: data.type ?? null,
        specificAreas: data.specificAreas ?? null,
        unitOfMeasure: data.unitOfMeasure ?? null,
        itemInMeasure: data.itemInMeasure ?? null,
        disaggregation: data.disaggregation ?? null,
        baseLine: data.baseLine ?? null,
        target: data.target ?? null,
        strategicObjectiveId: data.strategicObjectiveId ?? null,
      },
    });
  }

  return prisma.kpi.update({
    where: { kpiId: data.kpiId },
    data: {
      statement: data.statement ?? null,
      definition: data.definition ?? null,
      type: data.type ?? null,
      specificAreas: data.specificAreas ?? null,
      unitOfMeasure: data.unitOfMeasure ?? null,
      itemInMeasure: data.itemInMeasure ?? null,
      disaggregation: data.disaggregation ?? null,
      baseLine: data.baseLine ?? null,
      target: data.target ?? null,
      strategicObjectiveId: data.strategicObjectiveId ?? null,
      updateAt: new Date(),
    },
  });
};

export const deleteKpi = async (kpiId: string) => {
  return await prisma.kpi.delete({ where: { kpiId } });
};

export const getAllKpis = async () => {
  return await prisma.kpi.findMany();
};

export const getKpiById = async (kpiId: string) => {
  return await prisma.kpi.findUnique({ where: { kpiId } });
};

export const getKpiByStrategicObjectiveId = async (
  strategicObjectiveId: string
) => {
  return await prisma.kpi.findMany({ where: { strategicObjectiveId } });
};
