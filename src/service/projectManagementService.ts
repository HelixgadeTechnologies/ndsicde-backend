import { prisma, Project } from "../lib/prisma";
import {
  IActivity,
  IActivityReport,
  IActivityReportView,
  IActivityView,
  IImpact,
  IImpactView,
  IIndicator,
  IIndicatorReport,
  IIndicatorWithDisaggregation,
  IIndicatorReportWithDisaggregation,
  ILogicalFramework,
  ILogicalFrameworkView,
  IOutcome,
  IOutcomeView,
  IOutput,
  IOutputView,
  IPartner,
  IPartnerView,
  IReportStatus,
  ITeamMember,
  ITeamMemberView,
} from "../interface/projectManagementInterface";
import {
  IProjectStatus,
  IProjectView,
} from "../interface/projectManagementInterface";

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

  const data: Array<IProjectStatus> = outcomes.map((v: any) => ({
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
//create get partner by email
export const getPartnerByEmail = async (email: string) => {
  return await prisma.partner.findFirst({
    where: { email },
  });
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


// Get Impacts by project id (from view)
export const getImpactByProjectIdView = async (projectId: string) => {
  const impacts: Array<IImpactView> = await prisma.$queryRaw`
    SELECT * FROM impact_view WHERE projectId = ${projectId}
  `;
  return impacts;
};
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
  try {
    if (isCreate) {
      const indicator = await prisma.indicator.create({
        data: {
          indicatorSource: payload.indicatorSource,
          orgKpiId: payload.orgKpiId,
          thematicAreasOrPillar: payload.thematicAreasOrPillar,
          statement: payload.statement,
          linkKpiToSdnOrgKpi: payload.linkKpiToSdnOrgKpi,
          definition: payload.definition,
          specificArea: payload.specificArea,
          unitOfMeasure: payload.unitOfMeasure,
          itemInMeasure: payload.itemInMeasure,
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

      // Create disaggregation
      if (payload.IndicatorDisaggregation) {
        await Promise.all(
          payload.IndicatorDisaggregation.map(async (disaggregation) => {
            await prisma.indicatorDisaggregation.create({
              data: {
                indicatorId: indicator.indicatorId,
                type: disaggregation.type.toUpperCase(),
                category: disaggregation.category.toLowerCase(),
                target: disaggregation.target,
              },
            });
          })
        );
      }
      return indicator;
    } else {
      // IF isCreate === false
      const indicator = await prisma.indicator.update({
        where: { indicatorId: payload.indicatorId },
        data: {
          indicatorSource: payload.indicatorSource,
          orgKpiId: payload.orgKpiId,
          thematicAreasOrPillar: payload.thematicAreasOrPillar,
          statement: payload.statement,
          linkKpiToSdnOrgKpi: payload.linkKpiToSdnOrgKpi,
          definition: payload.definition,
          specificArea: payload.specificArea,
          unitOfMeasure: payload.unitOfMeasure,
          itemInMeasure: payload.itemInMeasure,
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

      // Update disaggregation
      if (payload.IndicatorDisaggregation) {
        await Promise.all(
          payload.IndicatorDisaggregation.map(async (disaggregation) => {
            await prisma.indicatorDisaggregation.update({
              where: { indicatorDisaggregationId: disaggregation.indicatorDisaggregationId },
              data: {
                indicatorId: indicator.indicatorId,
                type: disaggregation.type.toUpperCase(),
                category: disaggregation.category.toLowerCase(),
                target: disaggregation.target,
              },
            });
          })
        );
      }

      return indicator;
    }

  } catch (error) {
    throw error;
  }
};

// ✅ Get all specific result Indicators with details
export const getAllImpactIndicatorsByResultIdView = async (resultId: string): Promise<
  IIndicatorWithDisaggregation[]
> => {
  // Fetch related reports for all indicators
  const indicators = await prisma.indicator.findMany({
    where: { result: resultId },
    include: { IndicatorDisaggregation: true }
  });

  return indicators as any;
};

// ✅ Get a single Indicator by ID
export const getIndicatorByIdView = async (
  id: string
): Promise<IIndicatorWithDisaggregation | null> => {

  const indicator = await prisma.indicator.findUnique({
    where: { indicatorId: id },
    include: { IndicatorDisaggregation: true }
  });

  return indicator as any;
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
    const indicatorReport = await prisma.indicatorReport.create({
      data: {
        indicatorSource: payload.indicatorSource,
        orgKpiId: payload.orgKpiId,
        thematicAreasOrPillar: payload.thematicAreasOrPillar,
        indicatorStatement: payload.indicatorStatement,
        responsiblePersons: payload.responsiblePersons,
        actualDate: payload.actualDate,
        cumulativeActual: payload.cumulativeActual,
        actualNarrative: payload.actualNarrative,
        attachmentUrl: payload.attachmentUrl,
        status: IReportStatus.pending,
        resultTypeId: payload.resultTypeId,
        indicatorId: payload.indicatorId,
      },
    });

    // Create disaggregation
    if (payload.IndicatorReportDisaggregation) {
      await Promise.all(
        payload.IndicatorReportDisaggregation.map(async (disaggregation) => {
          await prisma.indicatorReportDisaggregation.create({
            data: {
              indicatorReportId: indicatorReport.indicatorReportId,
              type: disaggregation.type,
              category: disaggregation.category,
              actual: disaggregation.actual,
            },
          });
        })
      );
    }

    return indicatorReport;
  } else {
    if (!payload.indicatorReportId) {
      throw new Error("indicatorReportId is required for update");
    }
    const indicatorReport = await prisma.indicatorReport.update({
      where: {
        indicatorReportId: payload.indicatorReportId,
      },
      data: {
        indicatorSource: payload.indicatorSource,
        orgKpiId: payload.orgKpiId,
        thematicAreasOrPillar: payload.thematicAreasOrPillar,
        indicatorStatement: payload.indicatorStatement,
        responsiblePersons: payload.responsiblePersons,
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

    // Update disaggregation
    if (payload.IndicatorReportDisaggregation) {
      await Promise.all(
        payload.IndicatorReportDisaggregation.map(async (disaggregation) => {
          await prisma.indicatorReportDisaggregation.update({
            where: { indicatorReportDisaggregationId: disaggregation.indicatorReportDisaggregationId },
            data: {
              indicatorReportId: indicatorReport.indicatorReportId,
              type: disaggregation.type,
              category: disaggregation.category,
              actual: disaggregation.actual,
            },
          });
        })
      );
    }

    return indicatorReport;
  }
}

// Get all Impact Indicator Report Formats
export async function getAllIndicatorReportByResultId(resultId: string): Promise<
  IIndicatorReportWithDisaggregation[]
> {
  const reports = await prisma.indicatorReport.findMany({
    where: {
      indicator: {
        result: resultId,
      },
    },
    include: {
      IndicatorReportDisaggregation: true,
    },
  });

  return reports as any;
}

export async function getIndicatorReportById(
  id: string
): Promise<IIndicatorReportWithDisaggregation | null> {
  const report = await prisma.indicatorReport.findUnique({
    where: { indicatorReportId: id },
    include: { IndicatorReportDisaggregation: true },
  });

  return report as any;
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

// Get By Project ID
export const getOutcomeViewByProjectId = async (
  projectId: string
): Promise<IOutcomeView | null> => {
  const results = await prisma.$queryRaw<IOutcomeView[]>`
    SELECT * FROM outcome_view WHERE projectId = ${projectId}
  `;
  return results.length > 0 ? results[0] : null;
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

// ✅ Get Output by Project Id (from view)
export const getOutputByProjectId = async (
  projectId: string
): Promise<IOutputView | null> => {
  const rows: IOutputView[] = await prisma.$queryRaw`
    SELECT * FROM output_view WHERE "projectId" = ${projectId}
  `;
  return rows.length > 0 ? rows[0] : null;
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