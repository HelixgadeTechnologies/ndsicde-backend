import { Prisma, PrismaClient } from "@prisma/client";
import { Project } from "@prisma/client"; // Optional interface import
import {
  IActivity,
  IActivityReport,
  IActivityReportView,
  IActivityView,
  IAgeDisaggregation,
  IDepartmentDisaggregation,
  IGenderDisaggregation,
  IImpact,

  IImpactView,
  IIndicator,
  IIndicatorReport,
  IIndicatorReportView,
  IIndicatorView,
  ILgaDisaggregation,
  ILogicalFramework,
  ILogicalFrameworkView,

  IOutcome,

  IOutcomeView,
  IOutput,

  IOutputView,
  IPartner,
  IPartnerView,
  IProductDisaggregation,
  IReportStatus,
  IStateDisaggregation,
  ITeamMember,
  ITeamMemberView,
  ITenureDisaggregation,
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
        projectName: data.projectName ?? null,
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
      projectName: data.projectName ?? null,
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
  const existingUser = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!existingUser) {
    throw new Error("No user found with this email");
  }
  if (isCreate) {
    // CREATE
    return await prisma.teamMember.create({
      data: {
        userId: existingUser.userId,
        fullName: String(existingUser.fullName),
        email: String(existingUser.email),
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
        userId: existingUser.userId,
        fullName: String(existingUser.fullName),
        email: String(existingUser.email),
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
        resultTypeId: payload.resultTypeId
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
        resultTypeId: payload.resultTypeId,
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

// ✅ Create Indicator
export const createOrUpdateIndicator = async (
  payload: IIndicator,
  isCreate: boolean
): Promise<IIndicator> => {
  if (isCreate) {
    return await prisma.indicator.create({
      data: {
        indicatorSource: payload.indicatorSource,
        thematicAreasOrPillar: payload.thematicAreasOrPillar,
        statement: payload.statement,
        linkKpiToSdnOrgKpi: payload.linkKpiToSdnOrgKpi,
        definition: payload.definition,
        specificArea: payload.specificArea,
        unitOfMeasure: payload.unitOfMeasure,
        itemInMeasure: payload.itemInMeasure,
        disaggregationId: payload.disaggregationId,
        baseLineDate: payload.baseLineDate,
        cumulativeValue: payload.cumulativeValue,
        baselineNarrative: payload.baselineNarrative,
        targetDate: payload.targetDate,
        cumulativeTarget: payload.cumulativeTarget,
        targetNarrative: payload.targetNarrative,
        targetType: payload.targetType,
        responsiblePersons: payload.responsiblePersons,
        result: payload.result as string,
        resultTypeId: payload.resultTypeId
      },
    });
  }

  return await prisma.indicator.update({
    where: { indicatorId: payload.indicatorId },
    data: {
      indicatorSource: payload.indicatorSource,
      thematicAreasOrPillar: payload.thematicAreasOrPillar,
      statement: payload.statement,
      linkKpiToSdnOrgKpi: payload.linkKpiToSdnOrgKpi,
      definition: payload.definition,
      specificArea: payload.specificArea,
      unitOfMeasure: payload.unitOfMeasure,
      itemInMeasure: payload.itemInMeasure,
      disaggregationId: payload.disaggregationId,
      baseLineDate: payload.baseLineDate,
      cumulativeValue: payload.cumulativeValue,
      baselineNarrative: payload.baselineNarrative,
      targetDate: payload.targetDate,
      cumulativeTarget: payload.cumulativeTarget,
      targetNarrative: payload.targetNarrative,
      targetType: payload.targetType,
      responsiblePersons: payload.responsiblePersons,
      result: payload.result as string,
      resultTypeId: payload.resultTypeId,
      updateAt: new Date(),
    },
  });
};

// ✅ Get all specific result Indicators with details
export const getAllImpactIndicatorsByResultIdView = async (resultId: string): Promise<
  IIndicatorView[]
> => {
  return await prisma.$queryRaw<IIndicatorView[]>`
    SELECT * FROM indicator_view WHERE result = ${resultId};
  `;
};

// ✅ Get a single Indicator by ID
export const getIndicatorByIdView = async (
  id: string
): Promise<IIndicatorView | null> => {
  const result = await prisma.$queryRaw<IIndicatorView[]>`
    SELECT * FROM indicator_view WHERE indicatorId = ${id};
  `;
  return result.length > 0 ? result[0] : null;
};

// Delete Indicator
export const deleteIndicator = async (indicatorId: string) => {
  await prisma.indicatorReport.deleteMany({ where: { indicatorId } });
  return await prisma.indicator.delete({
    where: { indicatorId },
  });
};


// Create or Update Impact Indicator Report Format
export async function saveIndicatorReport(
  payload: IIndicatorReport,
  isCreate: boolean
) {
  if (isCreate) {
    return await prisma.indicatorReport.create({
      data: {
        indicatorSource: payload.indicatorSource,
        thematicAreasOrPillar: payload.thematicAreasOrPillar,
        indicatorStatement: payload.indicatorStatement,
        responsiblePersons: payload.responsiblePersons,
        disaggregationId: payload.disaggregationId,
        actualDate: payload.actualDate,
        cumulativeActual: payload.cumulativeActual,
        actualNarrative: payload.actualNarrative,
        attachmentUrl: payload.attachmentUrl,
        status: IReportStatus.pending,
        resultTypeId: payload.resultTypeId,
        indicatorId: payload.indicatorId,
      },
    });
  } else {
    if (!payload.indicatorReportId) {
      throw new Error("indicatorReportId is required for update");
    }
    return await prisma.indicatorReport.update({
      where: {
        indicatorReportId: payload.indicatorReportId,
      },
      data: {
        indicatorSource: payload.indicatorSource,
        thematicAreasOrPillar: payload.thematicAreasOrPillar,
        indicatorStatement: payload.indicatorStatement,
        responsiblePersons: payload.responsiblePersons,
        disaggregationId: payload.disaggregationId,
        actualDate: payload.actualDate,
        cumulativeActual: payload.cumulativeActual,
        actualNarrative: payload.actualNarrative,
        attachmentUrl: payload.attachmentUrl,
        status: payload.status,
        resultTypeId: payload.resultTypeId,
        indicatorId: payload.indicatorId,
        updateAt: new Date(), // update timestamp
      },
    });
  }
}

// Get all Impact Indicator Report Formats
export async function getAllIndicatorReportByResultId(resultId: string): Promise<
  IIndicatorReportView[]
> {
  return await prisma.$queryRaw<IIndicatorReportView[]>`
    SELECT * FROM indicator_report_view WHERE result = ${resultId};
  `;
}

export async function getIndicatorReportById(
  id: string
): Promise<IIndicatorReportView | null> {
  const result = await prisma.$queryRaw<IIndicatorReportView[]>`
    SELECT * FROM indicator_report_view
    WHERE indicatorReportId = ${id}
  `;
  return result.length > 0 ? result[0] : null;
}

export async function deleteIndicatorReport(id: string) {
  return await prisma.indicatorReport.delete({
    where: { indicatorReportId: id },
  });
}

// Create or Update Outcome
export const saveOutcome = async (
  payload: IOutcome,
  isCreate: boolean
): Promise<IOutcome> => {
  try {
    if (isCreate) {
      return await prisma.outcome.create({
        data: {
          outcomeStatement: payload.outcomeStatement,
          outcomeType: payload.outcomeType,
          impactId: payload.impactId,
          thematicAreas: payload.thematicAreas,
          responsiblePerson: payload.responsiblePerson,
          projectId: payload.projectId,
          resultTypeId: payload.resultTypeId,
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
          resultTypeId: payload.resultTypeId,
          updateAt: new Date(),
        },
      });
    }
  } catch (error) {
    throw error; // ✅ IMPORTANT
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
        resultTypeId: payload.resultTypeId,
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
        resultTypeId: payload.resultTypeId,
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

export const getResultType = async () => {
  return await prisma.resultType.findMany();
};

export const getAllDisaggregation = async () => {
  return await prisma.disaggregation.findMany();
};

export const createOrUpdateGenderAggregation = async (
  payload: IGenderDisaggregation,
  isCreate: boolean
) => {
  if (isCreate) {
    return await prisma.genderDisaggregation.create({
      data: {
        targetMale: Number(payload.targetMale),
        targetFemale: Number(payload.targetFemale),
        actualMale: Number(payload.actualMale),
        actualFemale: Number(payload.actualFemale),
        disaggregationId: payload.disaggregationId,
        indicatorId: payload.indicatorId,
      },
    });
  } else {
    if (!payload.genderDisaggregationId) {
      throw new Error("gender disaggregation Id is required for update");
    }

    return await prisma.genderDisaggregation.update({
      where: { genderDisaggregationId: payload.genderDisaggregationId },
      data: {
        targetMale: Number(payload.targetMale),
        targetFemale: Number(payload.targetFemale),
        actualMale: Number(payload.actualMale),
        actualFemale: Number(payload.actualFemale),
        disaggregationId: payload.disaggregationId,
        indicatorId: payload.indicatorId,
      },
    });
  }
};
export const getGenderDisaggregationByIndicatorId = async (indicatorId: string) => {
  return await prisma.genderDisaggregation.findMany({ where: { indicatorId } });
};

export const createOrUpdateProductDisaggregation = async (
  payload: Array<IProductDisaggregation>,
  isCreate: boolean
) => {
  if (isCreate) {
    return await prisma.productDisaggregation.createMany({
      data: payload.map(item => ({
        ProductName: item.productName,
        targetCount: Number(item.targetCount),
        actualCount: Number(item.actualCount),
        disaggregationId: item.disaggregationId,
        indicatorId: item.indicatorId,
      }
      )),
    });
  } else {

    // Bulk update using transaction
    const updateOperations = payload.map((item) =>
      prisma.productDisaggregation.update({
        where: { productDisaggregationId: item.productDisaggregationId },
        data: {
          productName: item.productName,
          targetCount: Number(item.targetCount),
          actualCount: Number(item.actualCount),
          disaggregationId: item.disaggregationId,
          indicatorId: item.indicatorId,
        },
      })
    );

    return await prisma.$transaction(updateOperations);
  }
};
export const getProductDisaggregationByIndicatorId = async (indicatorId: string) => {
  return await prisma.productDisaggregation.findMany({ where: { indicatorId } });
};

export const createOrUpdateDepartmentDisaggregation = async (
  payload: Array<IDepartmentDisaggregation>,
  isCreate: boolean
) => {
  if (isCreate) {
    return await prisma.departmentDisaggregation.createMany({
      data: payload.map(item => ({
        departmentName: item.departmentName,
        targetCount: Number(item.targetCount),
        actualCount: Number(item.actualCount),
        disaggregationId: item.disaggregationId,
        indicatorId: item.indicatorId,
      }
      )),
    });
  } else {

    // Bulk update using transaction
    const updateOperations = payload.map((item) =>
      prisma.departmentDisaggregation.update({
        where: { departmentDisaggregationId: item.departmentDisaggregationId },
        data: {
          departmentName: item.departmentName,
          targetCount: Number(item.targetCount),
          actualCount: Number(item.actualCount),
          disaggregationId: item.disaggregationId,
          indicatorId: item.indicatorId,
        },
      })
    );

    return await prisma.$transaction(updateOperations);
  }
};
export const getDepartmentDisaggregationByIndicatorId = async (indicatorId: string) => {
  return await prisma.departmentDisaggregation.findMany({ where: { indicatorId } });
};

export const createOrUpdateStateDisaggregation = async (
  payload: Array<IStateDisaggregation>,
  isCreate: boolean
) => {
  if (isCreate) {
    return await prisma.stateDisaggregation.createMany({
      data: payload.map(item => ({
        stateName: item.stateName,
        targetCount: Number(item.targetCount),
        actualCount: Number(item.actualCount),
        disaggregationId: item.disaggregationId,
        indicatorId: item.indicatorId,
      }
      )),
    });
  } else {

    // Bulk update using transaction
    const updateOperations = payload.map((item) =>
      prisma.stateDisaggregation.update({
        where: { stateDisaggregationId: item.stateDisaggregationId },
        data: {
          stateName: item.stateName,
          targetCount: Number(item.targetCount),
          actualCount: Number(item.actualCount),
          disaggregationId: item.disaggregationId,
          indicatorId: item.indicatorId,
        },
      })
    );

    return await prisma.$transaction(updateOperations);
  }
};
export const getStateDisaggregationByIndicatorId = async (indicatorId: string) => {
  return await prisma.stateDisaggregation.findMany({ where: { indicatorId } });
};

export const createOrUpdateLGADisaggregation = async (
  payload: Array<ILgaDisaggregation>,
  isCreate: boolean
) => {
  if (isCreate) {
    return await prisma.lgaDisaggregation.createMany({
      data: payload.map(item => ({
        lgaName: item.lgaName,
        targetCount: Number(item.targetCount),
        actualCount: Number(item.actualCount),
        disaggregationId: item.disaggregationId,
        indicatorId: item.indicatorId,
      }
      )),
    });
  } else {

    // Bulk update using transaction
    const updateOperations = payload.map((item) =>
      prisma.lgaDisaggregation.update({
        where: { lgaDisaggregationId: item.lgaDisaggregationId },
        data: {
          lgaName: item.lgaName,
          targetCount: Number(item.targetCount),
          actualCount: Number(item.actualCount),
          disaggregationId: item.disaggregationId,
          indicatorId: item.indicatorId,
        },
      })
    );

    return await prisma.$transaction(updateOperations);
  }
};
export const getLGADisaggregationByIndicatorId = async (indicatorId: string) => {
  return await prisma.lgaDisaggregation.findMany({ where: { indicatorId } });
};

export const createOrUpdateTenureDisaggregation = async (
  payload: Array<ITenureDisaggregation>,
  isCreate: boolean
) => {
  if (isCreate) {
    return await prisma.tenureDisaggregation.createMany({
      data: payload.map(item => ({
        tenureName: item.tenureName,
        targetCount: Number(item.targetCount),
        actualCount: Number(item.actualCount),
        disaggregationId: item.disaggregationId,
        indicatorId: item.indicatorId,
      }
      )),
    });
  } else {

    // Bulk update using transaction
    const updateOperations = payload.map((item) =>
      prisma.tenureDisaggregation.update({
        where: { tenureDisaggregationId: item.tenureDisaggregationId },
        data: {
          tenureName: item.tenureName,
          targetCount: Number(item.targetCount),
          actualCount: Number(item.actualCount),
          disaggregationId: item.disaggregationId,
          indicatorId: item.indicatorId,
        },
      })
    );

    return await prisma.$transaction(updateOperations);
  }
};
export const getTenureDisaggregationByIndicatorId = async (indicatorId: string) => {
  return await prisma.tenureDisaggregation.findMany({ where: { indicatorId } });
};

export const createOrUpdateAgeDisaggregation = async (
  payload: Array<IAgeDisaggregation>,
  isCreate: boolean
) => {
  if (isCreate) {
    return await prisma.ageDisaggregation.createMany({
      data: payload.map(item => ({
        targetFrom: Number(item.targetFrom),
        targetTo: Number(item.targetTo),
        actualFrom: Number(item.targetFrom),
        actualTo: Number(item.targetTo),
        disaggregationId: item.disaggregationId,
        indicatorId: item.indicatorId,
      }
      )),
    });
  } else {

    // Bulk update using transaction
    const updateOperations = payload.map((item) =>
      prisma.ageDisaggregation.update({
        where: { ageDisaggregationId: item.ageDisaggregationId },
        data: {
          targetFrom: Number(item.targetFrom),
          targetTo: Number(item.targetTo),
          actualFrom: Number(item.targetFrom),
          actualTo: Number(item.targetTo),
          disaggregationId: item.disaggregationId,
          indicatorId: item.indicatorId,
        },
      })
    );

    return await prisma.$transaction(updateOperations);
  }
};
export const getAgeDisaggregationByIndicatorId = async (indicatorId: string) => {
  return await prisma.ageDisaggregation.findMany({ where: { indicatorId } });
};