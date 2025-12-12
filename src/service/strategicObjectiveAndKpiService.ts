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
};

export const deleteStrategicObjective = async (
  strategicObjectiveId: string
) => {
  return await prisma.$transaction(async (tx) => {
    // Step 1: Delete all related KPIs
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

    console.log(result);
    return result;
  } catch (error: any) {
    console.error("Error fetching strategic objectives:", error);
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
  return prisma.kpi.delete({ where: { kpiId } });
};

export const getAllKpis = async () => {
  return prisma.kpi.findMany();
};

export const getKpiById = async (kpiId: string) => {
  return prisma.kpi.findUnique({ where: { kpiId } });
};

export const getKpiByStrategicObjectiveId = async (
  strategicObjectiveId: string
) => {
  return prisma.kpi.findMany({ where: { strategicObjectiveId } });
};
