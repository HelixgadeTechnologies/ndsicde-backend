import {
  IKpi,
  IStrategicObjective,
  IStrategicObjectiveView,
} from "../interface/strategicObjectiveAndKpiInterface";
import { prisma } from "../lib/prisma";
import type { Prisma } from "../lib/prisma";

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
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Step 1: Delete the KPIs
    await tx.kpi.deleteMany({
      where: { strategicObjectiveId },
    });

    // Step 2: Delete the strategic objective
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
        specificArea: data.specificArea ?? null,
        unitOfMeasure: data.unitOfMeasure ?? null,
        itemInMeasure: data.itemInMeasure ?? null,
        baseLineDate: data.baseLineDate ?? null,
        cumulativeValue: data.cumulativeValue ?? null,
        baselineNarrative: data.baselineNarrative ?? null,
        targetDate: data.targetDate ?? null,
        cumulativeTarget: data.cumulativeTarget ?? null,
        targetNarrative: data.targetNarrative ?? null,
        targetType: data.targetType ?? null,
        responsiblePersons: data.responsiblePersons ?? null,
        type: data.type ?? null,
        strategicObjectiveId: data.strategicObjectiveId ?? null,
        kpiDisaggregation: {
          create: data.kpiDisaggregation?.map(d => ({
            type: d.type || "",
            category: d.category || "",
            target: d.target,
            baseline: d.baseline
          })) || []
        }
      },
    });
  }

  // Delete existing disaggregations first
  await prisma.kpiDisaggregation.deleteMany({
    where: { kpiId: data.kpiId }
  });

  return prisma.kpi.update({
    where: { kpiId: data.kpiId },
    data: {
      statement: data.statement ?? null,
      definition: data.definition ?? null,
      specificArea: data.specificArea ?? null,
      unitOfMeasure: data.unitOfMeasure ?? null,
      itemInMeasure: data.itemInMeasure ?? null,
      baseLineDate: data.baseLineDate ?? null,
      cumulativeValue: data.cumulativeValue ?? null,
      baselineNarrative: data.baselineNarrative ?? null,
      targetDate: data.targetDate ?? null,
      cumulativeTarget: data.cumulativeTarget ?? null,
      targetNarrative: data.targetNarrative ?? null,
      targetType: data.targetType ?? null,
      responsiblePersons: data.responsiblePersons ?? null,
      type: data.type ?? null,
      strategicObjectiveId: data.strategicObjectiveId ?? null,
      updateAt: new Date(),
      kpiDisaggregation: {
        create: data.kpiDisaggregation?.map(d => ({
          type: d.type || "",
          category: d.category || "",
          target: d.target,
          baseline: d.baseline
        })) || []
      }
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
