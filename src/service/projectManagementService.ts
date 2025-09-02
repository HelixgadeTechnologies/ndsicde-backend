import { PrismaClient } from "@prisma/client";
import { Project } from "@prisma/client"; // Optional interface import
import {
  IActivity,
  IActivityReport,
  IActivityReportView,
  IActivityView,
  IImpact,
  IImpactIndicator,
  IImpactIndicatorReportFormat,
  IImpactIndicatorView,
  IImpactView,
  ILogicalFramework,
  ILogicalFrameworkView,
  ImpactIndicatorReportFormatView,
  IOutcome,
  IOutcomeIndicator,
  IOutcomeIndicatorReportFormat,
  IOutcomeIndicatorReportFormatView,
  IOutcomeIndicatorView,
  IOutcomeView,
  IOutput,
  IOutputIndicator,
  IOutputIndicatorReportFormat,
  IOutputIndicatorReportFormatView,
  IOutputIndicatorView,
  IOutputView,
  IPartner,
  IPartnerView,
  ITeamMember,
  ITeamMemberView,
} from "../interface/projectManagementInterface";
import {
  IProjectStatus,
  IProjectView,
} from "../interface/projectManagementInterface";

const prisma = new PrismaClient();

export const saveProject = async (
  data: Partial<Project>,
  isCreate: boolean
) => {
  if (isCreate) {
    return await prisma.project.create({
      data: {
        budgetCurrency: data.budgetCurrency ?? null,
        totalBudgetAmount: data.totalBudgetAmount ?? null,
        startDate: data.startDate ?? undefined,
        endDate: data.endDate ?? undefined,
        country: data.country ?? null,
        state: data.state ?? null,
        localGovernment: data.localGovernment ?? null,
        community: data.community ?? null,
        thematicAreasOrPillar: data.thematicAreasOrPillar ?? null,
        status: data.status ?? null,
        strategicObjectiveId: data.strategicObjectiveId ?? null,
      },
    });
  }

  return await prisma.project.update({
    where: { projectId: data.projectId },
    data: {
      budgetCurrency: data.budgetCurrency ?? null,
      totalBudgetAmount: data.totalBudgetAmount ?? null,
      startDate: data.startDate ?? undefined,
      endDate: data.endDate ?? undefined,
      country: data.country ?? null,
      state: data.state ?? null,
      localGovernment: data.localGovernment ?? null,
      community: data.community ?? null,
      thematicAreasOrPillar: data.thematicAreasOrPillar ?? null,
      status: data.status ?? null,
      strategicObjectiveId: data.strategicObjectiveId ?? null,
      updateAt: new Date(),
    },
  });
};

export const getAllProjects = async () => {
  const projects: Array<IProjectView> = await prisma.$queryRaw`
  SELECT * FROM project_view
`;
  return projects;
};
export const getProjectsStatus = async () => {
  const outcomes = await prisma.$queryRaw<any[]>`
    SELECT * FROM project_status_summary_view
  `;

  const data: Array<IProjectStatus> = outcomes.map((v) => ({
    totalProjects: Number(v.totalProjects),
    activeProjects: Number(v.activeProjects),
    completedProjects: Number(v.completedProjects),
    onHoldProjects: Number(v.onHoldProjects),
  }));

  return data[0];
};

export const getProjectById = async (projectId: string) => {
  return await prisma.project.findUnique({
    where: { projectId },
  });
};

export const deleteProject = async (projectId: string) => {
  return await prisma.project.delete({
    where: { projectId },
  });
};

// TEAM MEMBER
export const createOrUpdateTeamMember = async (
  payload: ITeamMember,
  isCreate: boolean
) => {
  if (isCreate) {
    // CREATE
    return await prisma.teamMember.create({
      data: {
        email: payload.email,
        roleId: payload.roleId,
        projectId: payload.projectId,
      },
    });
  } else {
    if (!payload.teamMemberId) {
      throw new Error("teamMemberId is required for update");
    }
    // UPDATE
    return await prisma.teamMember.update({
      where: { teamMemberId: payload.teamMemberId },
      data: {
        email: payload.email,
        roleId: payload.roleId,
        projectId: payload.projectId,
        updateAt: new Date(),
      },
    });
  }
};

export const getAllTeamMember = async () => {
  const teamMembers: Array<ITeamMemberView> = await prisma.$queryRaw`
  SELECT * FROM team_member_view
`;
  return teamMembers;
};

export const deleteTeamMember = async (teamMemberId: string) => {
  return await prisma.teamMember.delete({
    where: { teamMemberId },
  });
};

// Create or Update Partner
export const createOrUpdatePartner = async (
  payload: IPartner,
  isCreate: boolean
) => {
  if (isCreate) {
    // CREATE
    return await prisma.partner.create({
      data: {
        organizationName: payload.organizationName,
        email: payload.email,
        roleId: payload.roleId,
        projectId: payload.projectId,
      },
    });
  } else {
    if (!payload.partnerId) {
      throw new Error("partnerId is required for update");
    }
    // UPDATE
    return await prisma.partner.update({
      where: { partnerId: payload.partnerId },
      data: {
        organizationName: payload.organizationName,
        email: payload.email,
        roleId: payload.roleId,
        projectId: payload.projectId,
        updateAt: new Date(),
      },
    });
  }
};

// Get all Partners (from view)
export const getAllPartners = async () => {
  const partners: Array<IPartnerView> = await prisma.$queryRaw`
    SELECT * FROM partner_view
  `;
  return partners;
};

// Delete Partner
export const deletePartner = async (partnerId: string) => {
  return await prisma.partner.delete({
    where: { partnerId },
  });
};

// Create or Update Impact
export const createOrUpdateImpact = async (
  payload: IImpact,
  isCreate: boolean
) => {
  if (isCreate) {
    // CREATE
    return await prisma.impact.create({
      data: {
        statement: payload.statement,
        thematicArea: payload.thematicArea,
        responsiblePerson: payload.responsiblePerson,
        projectId: payload.projectId,
      },
    });
  } else {
    if (!payload.impactId) {
      throw new Error("impactId is required for update");
    }
    // UPDATE
    return await prisma.impact.update({
      where: { impactId: payload.impactId },
      data: {
        statement: payload.statement,
        thematicArea: payload.thematicArea,
        responsiblePerson: payload.responsiblePerson,
        projectId: payload.projectId,
        updateAt: new Date(),
      },
    });
  }
};

// Get all Impacts (from view)
export const getAllImpact = async () => {
  const impacts: Array<IImpactView> = await prisma.$queryRaw`
    SELECT * FROM impact_view
  `;
  return impacts;
};

// Delete Impact
export const deleteImpact = async (impactId: string) => {
  return await prisma.impact.delete({
    where: { impactId },
  });
};

// ✅ Create Impact Indicator
export const createOrUpdateImpactIndicator = async (
  payload: IImpactIndicator,
  isCreate: boolean
): Promise<IImpactIndicator> => {
  if (isCreate) {
    return await prisma.impactIndicator.create({
      data: {
        indicatorSource: payload.indicatorSource,
        thematicAreasOrPillar: payload.thematicAreasOrPillar,
        statement: payload.statement,
        linkKpiToSdnOrgKpi: payload.linkKpiToSdnOrgKpi,
        definition: payload.definition,
        specificArea: payload.specificArea,
        unitOfMeasure: payload.unitOfMeasure,
        itemInMeasure: payload.itemInMeasure,
        disaggregation: payload.disaggregation,
        baseLineDate: payload.baseLineDate,
        cumulativeValue: payload.cumulativeValue,
        baselineNarrative: payload.baselineNarrative,
        targetDate: payload.targetDate,
        cumulativeTarget: payload.cumulativeTarget,
        targetNarrative: payload.targetNarrative,
        targetType: payload.targetType,
        responsiblePersons: payload.responsiblePersons,
        impactId: payload.impactId,
      },
    });
  }

  return await prisma.impactIndicator.update({
    where: { impactIndicatorId: payload.impactIndicatorId },
    data: {
      indicatorSource: payload.indicatorSource,
      thematicAreasOrPillar: payload.thematicAreasOrPillar,
      statement: payload.statement,
      linkKpiToSdnOrgKpi: payload.linkKpiToSdnOrgKpi,
      definition: payload.definition,
      specificArea: payload.specificArea,
      unitOfMeasure: payload.unitOfMeasure,
      itemInMeasure: payload.itemInMeasure,
      disaggregation: payload.disaggregation,
      baseLineDate: payload.baseLineDate,
      cumulativeValue: payload.cumulativeValue,
      baselineNarrative: payload.baselineNarrative,
      targetDate: payload.targetDate,
      cumulativeTarget: payload.cumulativeTarget,
      targetNarrative: payload.targetNarrative,
      targetType: payload.targetType,
      responsiblePersons: payload.responsiblePersons,
      impactId: payload.impactId,
      updateAt: new Date(),
    },
  });
};

// ✅ Get all Impact Indicators with Impact details
export const getAllImpactIndicatorsView = async (): Promise<
  IImpactIndicatorView[]
> => {
  return await prisma.$queryRaw<IImpactIndicatorView[]>`
    SELECT * FROM impact_indicator_view;
  `;
};

// ✅ Get a single Impact Indicator by ID
export const getImpactIndicatorByIdView = async (
  id: string
): Promise<IImpactIndicatorView | null> => {
  const result = await prisma.$queryRaw<IImpactIndicatorView[]>`
    SELECT * FROM impact_indicator_view WHERE impactIndicatorId = ${id};
  `;
  return result.length > 0 ? result[0] : null;
};

// ✅ Get all Impact Indicators by Project ID (optional helper)
export const getImpactIndicatorsByProjectIdView = async (
  projectId: string
): Promise<IImpactIndicatorView[]> => {
  return await prisma.$queryRaw<IImpactIndicatorView[]>`
    SELECT * FROM impact_indicator_view WHERE projectId = ${projectId};
  `;
};

// Create or Update Impact Indicator Report Format
export async function saveImpactIndicatorReportFormat(
  payload: IImpactIndicatorReportFormat,
  isCreate: boolean
) {
  if (isCreate) {
    return await prisma.impactIndicatorReportFormat.create({
      data: {
        indicatorSource: payload.indicatorSource,
        thematicAreasOrPillar: payload.thematicAreasOrPillar,
        indicatorStatement: payload.indicatorStatement,
        responsiblePersons: payload.responsiblePersons,
        disaggregationType: payload.disaggregationType,
        linkKpiToSdnOrgKpi: payload.linkKpiToSdnOrgKpi,
        definition: payload.definition,
        specificArea: payload.specificArea,
        unitOfMeasure: payload.unitOfMeasure,
        itemInMeasure: payload.itemInMeasure,
        actualDate: payload.actualDate,
        cumulativeActual: payload.cumulativeActual,
        actualNarrative: payload.actualNarrative,
        attachmentUrl: payload.attachmentUrl,
        impactIndicatorId: payload.impactIndicatorId,
      },
    });
  } else {
    if (!payload.impactIndicatorReportFormatId) {
      throw new Error("impactIndicatorReportFormatId is required for update");
    }
    return await prisma.impactIndicatorReportFormat.update({
      where: {
        impactIndicatorReportFormatId: payload.impactIndicatorReportFormatId,
      },
      data: {
        indicatorSource: payload.indicatorSource,
        thematicAreasOrPillar: payload.thematicAreasOrPillar,
        indicatorStatement: payload.indicatorStatement,
        responsiblePersons: payload.responsiblePersons,
        disaggregationType: payload.disaggregationType,
        linkKpiToSdnOrgKpi: payload.linkKpiToSdnOrgKpi,
        definition: payload.definition,
        specificArea: payload.specificArea,
        unitOfMeasure: payload.unitOfMeasure,
        itemInMeasure: payload.itemInMeasure,
        actualDate: payload.actualDate,
        cumulativeActual: payload.cumulativeActual,
        actualNarrative: payload.actualNarrative,
        attachmentUrl: payload.attachmentUrl,
        impactIndicatorId: payload.impactIndicatorId,
        updateAt: new Date(), // update timestamp
      },
    });
  }
}

// Get all Impact Indicator Report Formats
export async function getAllImpactIndicatorReportFormats(): Promise<
  ImpactIndicatorReportFormatView[]
> {
  return await prisma.$queryRaw<ImpactIndicatorReportFormatView[]>`
    SELECT * FROM impact_indicator_report_format_view
  `;
}

export async function getImpactIndicatorReportFormatById(
  id: string
): Promise<ImpactIndicatorReportFormatView | null> {
  const result = await prisma.$queryRaw<ImpactIndicatorReportFormatView[]>`
    SELECT * FROM impact_indicator_report_format_view
    WHERE impactIndicatorReportFormatId = ${id}
  `;
  return result.length > 0 ? result[0] : null;
}

export async function deleteImpactIndicatorReportFormat(id: string) {
  return await prisma.impactIndicatorReportFormat.delete({
    where: { impactIndicatorReportFormatId: id },
  });
}

// Create or Update Outcome
export const saveOutcome = async (
  payload: IOutcome,
  isCreate: boolean
): Promise<IOutcome> => {
  if (isCreate) {
    return await prisma.outcome.create({
      data: {
        outcomeStatement: payload.outcomeStatement,
        outcomeType: payload.outcomeType,
        impactId: payload.impactId,
        thematicAreas: payload.thematicAreas,
        responsiblePerson: payload.responsiblePerson,
        projectId: payload.projectId,
      },
    });
  } else {
    if (!payload.outcomeId) {
      throw new Error("Outcome ID is required for update.");
    }
    return await prisma.outcome.update({
      where: { outcomeId: payload.outcomeId },
      data: {
        outcomeStatement: payload.outcomeStatement,
        outcomeType: payload.outcomeType,
        impactId: payload.impactId,
        thematicAreas: payload.thematicAreas,
        responsiblePerson: payload.responsiblePerson,
        projectId: payload.projectId,
        updateAt: new Date(),
      },
    });
  }
};

// Get All
export const getAllOutcomesView = async (): Promise<IOutcomeView[]> => {
  return await prisma.$queryRaw<IOutcomeView[]>`
    SELECT * FROM outcome_view
  `;
};

// Get By ID
export const getOutcomeViewById = async (
  outcomeId: string
): Promise<IOutcomeView | null> => {
  const results = await prisma.$queryRaw<IOutcomeView[]>`
    SELECT * FROM outcome_view WHERE outcomeId = ${outcomeId}
  `;
  return results.length > 0 ? results[0] : null;
};

// Delete
export const deleteOutcome = async (outcomeId: string): Promise<void> => {
  await prisma.outcome.delete({
    where: { outcomeId },
  });
};

// Create or Update OutcomeIndicator
export const saveOutcomeIndicator = async (
  payload: IOutcomeIndicator,
  isCreate: boolean
): Promise<IOutcomeIndicator> => {
  if (isCreate) {
    return await prisma.outcomeIndicator.create({
      data: {
        indicatorSource: payload.indicatorSource,
        thematicAreasOrPillar: payload.thematicAreasOrPillar,
        statement: payload.statement,
        linkKpiToSdnOrgKpi: payload.linkKpiToSdnOrgKpi,
        definition: payload.definition,
        specificArea: payload.specificArea,
        unitOfMeasure: payload.unitOfMeasure,
        itemInMeasure: payload.itemInMeasure,
        disaggregation: payload.disaggregation,
        baseLineDate: payload.baseLineDate,
        cumulativeValue: payload.cumulativeValue,
        baselineNarrative: payload.baselineNarrative,
        targetDate: payload.targetDate,
        cumulativeTarget: payload.cumulativeTarget,
        targetNarrative: payload.targetNarrative,
        targetType: payload.targetType,
        responsiblePersons: payload.responsiblePersons,
        outcomeId: payload.outcomeId,
      },
    });
  } else {
    if (!payload.outcomeIndicatorId) {
      throw new Error("OutcomeIndicator ID is required for update.");
    }

    return await prisma.outcomeIndicator.update({
      where: { outcomeIndicatorId: payload.outcomeIndicatorId },
      data: {
        indicatorSource: payload.indicatorSource,
        thematicAreasOrPillar: payload.thematicAreasOrPillar,
        statement: payload.statement,
        linkKpiToSdnOrgKpi: payload.linkKpiToSdnOrgKpi,
        definition: payload.definition,
        specificArea: payload.specificArea,
        unitOfMeasure: payload.unitOfMeasure,
        itemInMeasure: payload.itemInMeasure,
        disaggregation: payload.disaggregation,
        baseLineDate: payload.baseLineDate,
        cumulativeValue: payload.cumulativeValue,
        baselineNarrative: payload.baselineNarrative,
        targetDate: payload.targetDate,
        cumulativeTarget: payload.cumulativeTarget,
        targetNarrative: payload.targetNarrative,
        targetType: payload.targetType,
        responsiblePersons: payload.responsiblePersons,
        outcomeId: payload.outcomeId,
        updateAt: new Date(),
      },
    });
  }
};

// Get All from View
export const getAllOutcomeIndicatorsView = async (): Promise<
  IOutcomeIndicatorView[]
> => {
  return await prisma.$queryRaw<IOutcomeIndicatorView[]>`
    SELECT * FROM outcomeindicator_view
  `;
};

// Get By ID from View
export const getOutcomeIndicatorViewById = async (
  outcomeIndicatorId: string
): Promise<IOutcomeIndicatorView | null> => {
  const results = await prisma.$queryRaw<IOutcomeIndicatorView[]>`
    SELECT * FROM outcomeindicator_view WHERE outcomeIndicatorId = ${outcomeIndicatorId}
  `;
  return results.length > 0 ? results[0] : null;
};

// Delete
export const deleteOutcomeIndicator = async (
  outcomeIndicatorId: string
): Promise<void> => {
  await prisma.outcomeIndicator.delete({
    where: { outcomeIndicatorId },
  });
};

export const saveOutcomeIndicatorReportFormat = async (
  payload: IOutcomeIndicatorReportFormat,
  isCreate: boolean
): Promise<IOutcomeIndicatorReportFormat> => {
  if (isCreate) {
    return await prisma.outcomeIndicatorReportFormat.create({
      data: {
        indicatorSource: payload.indicatorSource,
        thematicAreasOrPillar: payload.thematicAreasOrPillar,
        indicatorStatement: payload.indicatorStatement,
        responsiblePersons: payload.responsiblePersons,
        disaggregationType: payload.disaggregationType,
        linkKpiToSdnOrgKpi: payload.linkKpiToSdnOrgKpi,
        definition: payload.definition,
        specificArea: payload.specificArea,
        unitOfMeasure: payload.unitOfMeasure,
        itemInMeasure: payload.itemInMeasure,
        actualDate: payload.actualDate,
        cumulativeActual: payload.cumulativeActual,
        actualNarrative: payload.actualNarrative,
        attachmentUrl: payload.attachmentUrl,
        outcomeIndicatorId: payload.outcomeIndicatorId,
      },
    });
  } else {
    if (!payload.outcomeIndicatorReportFormatId) {
      throw new Error("outcomeIndicatorReportFormatId is required for update");
    }

    return await prisma.outcomeIndicatorReportFormat.update({
      where: {
        outcomeIndicatorReportFormatId: payload.outcomeIndicatorReportFormatId,
      },
      data: {
        indicatorSource: payload.indicatorSource,
        thematicAreasOrPillar: payload.thematicAreasOrPillar,
        indicatorStatement: payload.indicatorStatement,
        responsiblePersons: payload.responsiblePersons,
        disaggregationType: payload.disaggregationType,
        linkKpiToSdnOrgKpi: payload.linkKpiToSdnOrgKpi,
        definition: payload.definition,
        specificArea: payload.specificArea,
        unitOfMeasure: payload.unitOfMeasure,
        itemInMeasure: payload.itemInMeasure,
        actualDate: payload.actualDate,
        cumulativeActual: payload.cumulativeActual,
        actualNarrative: payload.actualNarrative,
        attachmentUrl: payload.attachmentUrl,
        outcomeIndicatorId: payload.outcomeIndicatorId,
        updateAt: new Date(),
      },
    });
  }
};

export const getAllOutcomeIndicatorReportFormats = async (): Promise<
  Array<IOutcomeIndicatorReportFormatView>
> => {
  const results = await prisma.$queryRaw<IOutcomeIndicatorReportFormatView[]>`
    SELECT * FROM outcome_indicator_report_format_view
    ORDER BY "createAt" DESC
  `;
  return results;
};

export const getOutcomeIndicatorReportFormatById = async (
  id: string
): Promise<IOutcomeIndicatorReportFormatView | null> => {
  const results = await prisma.$queryRaw<IOutcomeIndicatorReportFormatView[]>`
    SELECT * FROM outcome_indicator_report_format_view WHERE "outcomeIndicatorReportFormatId" = ${id}
  `;
  return results.length > 0 ? results[0] : null;
};

export const deleteOutcomeIndicatorReportFormat = async (
  id: string
): Promise<IOutcomeIndicatorReportFormat> => {
  return await prisma.outcomeIndicatorReportFormat.delete({
    where: { outcomeIndicatorReportFormatId: id },
  });
};


// ✅ Create or Update Output
export const createOrUpdateOutput = async (
  payload: IOutput,
  isCreate: boolean
) => {
  if (isCreate) {
    return await prisma.output.create({
      data: {
        outputStatement: payload.outputStatement,
        outcomeId: payload.outcomeId,
        thematicAreas: payload.thematicAreas,
        responsiblePerson: payload.responsiblePerson,
        projectId: payload.projectId,
      },
    });
  } else {
    if (!payload.outputId) {
      throw new Error("outputId is required for update");
    }

    return await prisma.output.update({
      where: { outputId: payload.outputId },
      data: {
        outputStatement: payload.outputStatement,
        outcomeId: payload.outcomeId,
        thematicAreas: payload.thematicAreas,
        responsiblePerson: payload.responsiblePerson,
        projectId: payload.projectId,
        updateAt: new Date(),
      },
    });
  }
};

// ✅ Get all Outputs (from view)
export const getAllOutputs = async (): Promise<IOutputView[]> => {
  const outputs: IOutputView[] = await prisma.$queryRaw`
    SELECT * FROM output_view
  `;
  return outputs;
};

// ✅ Get Output by Id (from view)
export const getOutputById = async (
  outputId: string
): Promise<IOutputView | null> => {
  const rows: IOutputView[] = await prisma.$queryRaw`
    SELECT * FROM output_view WHERE "outputId" = ${outputId}
  `;
  return rows.length > 0 ? rows[0] : null;
};

// ✅ Delete Output
export const deleteOutput = async (outputId: string) => {
  await prisma.output.delete({
    where: { outputId },
  });
};


// ✅ Create or Update OutputIndicator
export const createOrUpdateOutputIndicator = async (
  payload: IOutputIndicator,
  isCreate: boolean
) => {
  if (isCreate) {
    return await prisma.outputIndicator.create({
      data: {
        indicatorSource: payload.indicatorSource,
        thematicAreasOrPillar: payload.thematicAreasOrPillar,
        statement: payload.statement,
        linkKpiToSdnOrgKpi: payload.linkKpiToSdnOrgKpi,
        definition: payload.definition,
        specificArea: payload.specificArea,
        unitOfMeasure: payload.unitOfMeasure,
        itemInMeasure: payload.itemInMeasure,
        disaggregation: payload.disaggregation,
        baseLineDate: payload.baseLineDate,
        cumulativeValue: payload.cumulativeValue,
        baselineNarrative: payload.baselineNarrative,
        targetDate: payload.targetDate,
        cumulativeTarget: payload.cumulativeTarget,
        targetNarrative: payload.targetNarrative,
        targetType: payload.targetType,
        responsiblePersons: payload.responsiblePersons,
        outputId: payload.outputId,
      },
    });
  } else {
    if (!payload.outputIndicatorId) {
      throw new Error("outputIndicatorId is required for update");
    }

    return await prisma.outputIndicator.update({
      where: { outputIndicatorId: payload.outputIndicatorId },
      data: {
        indicatorSource: payload.indicatorSource,
        thematicAreasOrPillar: payload.thematicAreasOrPillar,
        statement: payload.statement,
        linkKpiToSdnOrgKpi: payload.linkKpiToSdnOrgKpi,
        definition: payload.definition,
        specificArea: payload.specificArea,
        unitOfMeasure: payload.unitOfMeasure,
        itemInMeasure: payload.itemInMeasure,
        disaggregation: payload.disaggregation,
        baseLineDate: payload.baseLineDate,
        cumulativeValue: payload.cumulativeValue,
        baselineNarrative: payload.baselineNarrative,
        targetDate: payload.targetDate,
        cumulativeTarget: payload.cumulativeTarget,
        targetNarrative: payload.targetNarrative,
        targetType: payload.targetType,
        responsiblePersons: payload.responsiblePersons,
        outputId: payload.outputId,
        updateAt: new Date(),
      },
    });
  }
};

// ✅ Get all OutputIndicators (from view)
export const getAllOutputIndicators = async (): Promise<IOutputIndicatorView[]> => {
  const indicators: IOutputIndicatorView[] = await prisma.$queryRaw`
    SELECT * FROM output_indicator_view
  `;
  return indicators;
};

// ✅ Get OutputIndicator by Id (from view)
export const getOutputIndicatorById = async (
  outputIndicatorId: string
): Promise<IOutputIndicatorView | null> => {
  const rows: IOutputIndicatorView[] = await prisma.$queryRaw`
    SELECT * FROM output_indicator_view WHERE "outputIndicatorId" = ${outputIndicatorId}
  `;
  return rows.length > 0 ? rows[0] : null;
};

// ✅ Delete OutputIndicator
export const deleteOutputIndicator = async (outputIndicatorId: string) => {
  await prisma.outputIndicator.delete({
    where: { outputIndicatorId },
  });
};



// ✅ Create or Update OutputIndicatorReportFormat
export const createOrUpdateOutputIndicatorReportFormat = async (
  payload: IOutputIndicatorReportFormat,
  isCreate: boolean
) => {
  if (isCreate) {
    return await prisma.outputIndicatorReportFormat.create({
      data: {
        indicatorSource: payload.indicatorSource,
        thematicAreasOrPillar: payload.thematicAreasOrPillar,
        indicatorStatement: payload.indicatorStatement,
        responsiblePersons: payload.responsiblePersons,
        disaggregationType: payload.disaggregationType,
        actualDate: payload.actualDate,
        cumulativeActual: payload.cumulativeActual,
        actualNarrative: payload.actualNarrative,
        attachmentUrl: payload.attachmentUrl,
        createAt: payload.createAt,
        updateAt: new Date(),
        outputIndicatorId: payload.outputIndicatorId,
      },
    });
  } else {
    if (!payload.outputIndicatorReportFormatId) {
      throw new Error("outputIndicatorReportFormatId is required for update");
    }

    return await prisma.outputIndicatorReportFormat.update({
      where: { outputIndicatorReportFormatId: payload.outputIndicatorReportFormatId },
      data: {
        indicatorSource: payload.indicatorSource,
        thematicAreasOrPillar: payload.thematicAreasOrPillar,
        indicatorStatement: payload.indicatorStatement,
        responsiblePersons: payload.responsiblePersons,
        disaggregationType: payload.disaggregationType,
        actualDate: payload.actualDate,
        cumulativeActual: payload.cumulativeActual,
        actualNarrative: payload.actualNarrative,
        attachmentUrl: payload.attachmentUrl,
        createAt: payload.createAt,
        updateAt: new Date(),
        outputIndicatorId: payload.outputIndicatorId,
      },
    });
  }
};

// ✅ Get All (from view)
export const getAllOutputIndicatorReportFormats = async (): Promise<IOutputIndicatorReportFormatView[]> => {
  return await prisma.$queryRaw<IOutputIndicatorReportFormatView[]>`
    SELECT * FROM output_indicator_report_format_view
  `;
};

// ✅ Get By Id (from view)
export const getOutputIndicatorReportFormatById = async (
  id: string
): Promise<IOutputIndicatorReportFormatView | null> => {
  const result = await prisma.$queryRaw<IOutputIndicatorReportFormatView[]>`
    SELECT * 
    FROM output_indicator_report_format_view 
    WHERE outputIndicatorReportFormatId = ${id}
  `;
  return result.length > 0 ? result[0] : null;
};

// ✅ Delete
export const deleteOutputIndicatorReportFormat = async (id: string) => {
  return await prisma.outputIndicatorReportFormat.delete({
    where: { outputIndicatorReportFormatId: id },
  });
};


// ✅ Create or Update Activity
export const createOrUpdateActivity = async (
  payload: IActivity,
  isCreate: boolean
) => {
  if (isCreate) {
    return await prisma.activity.create({
      data: {
        activityStatement: payload.activityStatement,
        outputId: payload.outputId,
        activityTotalBudget: payload.activityTotalBudget,
        responsiblePerson: payload.responsiblePerson,
        startDate: payload.startDate,
        endDate: payload.endDate,
        activityFrequency: payload.activityFrequency,
        subActivity: payload.subActivity,
        descriptionAction: payload.descriptionAction,
        deliveryDate: payload.deliveryDate,
        projectId: payload.projectId,
      },
    });
  } else {
    if (!payload.activityId) {
      throw new Error("activityId is required for update");
    }

    return await prisma.activity.update({
      where: { activityId: payload.activityId },
      data: {
        activityStatement: payload.activityStatement,
        outputId: payload.outputId,
        activityTotalBudget: payload.activityTotalBudget,
        responsiblePerson: payload.responsiblePerson,
        startDate: payload.startDate,
        endDate: payload.endDate,
        activityFrequency: payload.activityFrequency,
        subActivity: payload.subActivity,
        descriptionAction: payload.descriptionAction,
        deliveryDate: payload.deliveryDate,
        projectId: payload.projectId,
        updateAt: new Date(),
      },
    });
  }
};

// ✅ Get all Activities (from view)
export const getAllActivities = async (): Promise<IActivityView[]> => {
  return await prisma.$queryRaw<IActivityView[]>`
    SELECT * FROM activity_view
  `;
};

// ✅ Get Activity by Id (from view)
export const getActivityById = async (id: string): Promise<IActivityView | null> => {
  const result = await prisma.$queryRaw<IActivityView[]>`
    SELECT * FROM activity_view WHERE activityId = ${id}
  `;
  return result.length > 0 ? result[0] : null;
};

// ✅ Delete Activity
export const deleteActivity = async (id: string) => {
  return await prisma.activity.delete({
    where: { activityId: id },
  });
};


// ✅ Create or Update ActivityReport
export const createOrUpdateActivityReport = async (
  payload: IActivityReport,
  isCreate: boolean
) => {
  if (isCreate) {
    return await prisma.activityReport.create({
      data: {
        activityId: payload.activityId,
        percentageCompletion: payload.percentageCompletion,
        actualStartDate: payload.actualStartDate,
        actualEndDate: payload.actualEndDate,
        actualCost: payload.actualCost,
        actualNarrative: payload.actualNarrative,
      },
    });
  } else {
    if (!payload.activityReportId) {
      throw new Error("activityReportId is required for update");
    }

    return await prisma.activityReport.update({
      where: { activityReportId: payload.activityReportId },
      data: {
        activityId: payload.activityId,
        percentageCompletion: payload.percentageCompletion,
        actualStartDate: payload.actualStartDate,
        actualEndDate: payload.actualEndDate,
        actualCost: payload.actualCost,
        actualNarrative: payload.actualNarrative,
        updateAt: new Date(),
      },
    });
  }
};

// ✅ Get all ActivityReports (from view)
export const getAllActivityReports = async (): Promise<IActivityReportView[]> => {
  return await prisma.$queryRaw<IActivityReportView[]>`
    SELECT * FROM activity_report_view
  `;
};

// ✅ Get ActivityReport by Id (from view)
export const getActivityReportById = async (id: string): Promise<IActivityReportView | null> => {
  const result = await prisma.$queryRaw<IActivityReportView[]>`
    SELECT * FROM activity_report_view WHERE activityReportId = ${id}
  `;
  return result.length > 0 ? result[0] : null;
};

// ✅ Delete ActivityReport
export const deleteActivityReport = async (id: string) => {
  return await prisma.activityReport.delete({
    where: { activityReportId: id },
  });
};

// ✅ Create or Update LogicalFramework
export const createOrUpdateLogicalFramework = async (
  payload: ILogicalFramework,
  isCreate: boolean
) => {
  if (isCreate) {
    return await prisma.logicalFramework.create({
      data: {
        projectId: payload.projectId,
        documentName: payload.documentName,
        documentURL: payload.documentURL,
      },
    });
  } else {
    if (!payload.logicalFrameworkId) {
      throw new Error("logicalFrameworkId is required for update");
    }

    return await prisma.logicalFramework.update({
      where: { logicalFrameworkId: payload.logicalFrameworkId },
      data: {
        projectId: payload.projectId,
        documentName: payload.documentName,
        documentURL: payload.documentURL,
        updateAt: new Date(),
      },
    });
  }
};

// ✅ Get all LogicalFrameworks (from view)
export const getAllLogicalFrameworks = async (): Promise<ILogicalFrameworkView[]> => {
  return await prisma.$queryRaw<ILogicalFrameworkView[]>`
    SELECT * FROM logical_framework_view
  `;
};

// ✅ Get LogicalFramework by Id (from view)
export const getLogicalFrameworkById = async (
  id: string
): Promise<ILogicalFrameworkView | null> => {
  const result = await prisma.$queryRaw<ILogicalFrameworkView[]>`
    SELECT * FROM logical_framework_view WHERE logicalFrameworkId = ${id}
  `;
  return result.length > 0 ? result[0] : null;
};

// ✅ Delete LogicalFramework
export const deleteLogicalFramework = async (id: string) => {
  return await prisma.logicalFramework.delete({
    where: { logicalFrameworkId: id },
  });
};
