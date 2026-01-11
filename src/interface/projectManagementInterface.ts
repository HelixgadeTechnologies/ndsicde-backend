export interface IProject {
  projectId: string;
  projectName?: string;
  budgetCurrency?: string;
  totalBudgetAmount?: string;
  startDate?: Date;
  endDate?: Date;
  country?: string;
  state?: string;
  localGovernment?: string;
  community?: string;
  thematicAreasOrPillar?: string;
  status?: string;
  strategicObjectiveId?: string;
  createAt?: Date;
  updateAt?: Date;
}

export interface IProjectStatus {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  onHoldProjects: number;
}

export interface IProjectView {
  projectId: string;
  projectName?: string;
  budgetCurrency?: string;
  totalBudgetAmount?: string;
  startDate?: Date;
  endDate?: Date;
  country?: string;
  state?: string;
  localGovernment?: string;
  community?: string;
  thematicAreasOrPillar?: string;
  status?: string;
  strategicObjectiveId?: string;
  strategicObjectiveStatement?: string;
  createAt?: Date;
  updateAt?: Date;
}

export interface ITeamMember {
  teamMemberId?: string; // Required for update
  email: string;
  roleId: string;
  projectId?: string;
}

export interface ITeamMemberView {
  teamMemberId: string;
  userId: string;
  fullName: string;
  email: string;
  roleId: string;
  roleName: string | null; // because LEFT JOIN may return null
  projectId: string | null; // because LEFT JOIN may return null
  projectName: string | null;
  createAt: Date | string; // depending on how Prisma/driver returns
  updateAt: Date | string;
}

export interface IPartner {
  partnerId?: string; // optional for create
  organizationName: string;
  email: string;
  roleId: string;
  projectId?: string | null; // can be null if no project is linked
  createAt?: Date | string;
  updateAt?: Date | string;
}
export interface IPartnerView {
  partnerId: string;
  organizationName: string;
  email: string;
  roleId: string;
  roleName: string | null; // because LEFT JOIN may return null
  projectId: string | null; // because LEFT JOIN may return null
  projectName: string | null; // because LEFT JOIN may return null
  createAt: Date | string; // depending on how Prisma/driver returns
  updateAt: Date | string;
}

export interface IImpact {
  impactId: string;
  statement: string;
  thematicArea: string;
  responsiblePerson: string;
  projectId?: string | null;
  resultTypeId?: string | null;
  createAt?: Date;
  updateAt?: Date;
}

export interface IImpactView {
  impactId: string;
  statement: string;
  thematicArea: string;
  responsiblePerson: string;
  projectId?: string | null;
  projectName?: string | null; // comes from the joined project table
  resultTypeId?: string | null;
  resultName?: string | null;
  createAt?: Date;
  updateAt?: Date;
}

export interface IIndicator {
  indicatorId: string;
  indicatorSource?: string | null;
  thematicAreasOrPillar?: string | null;
  statement?: string | null;
  linkKpiToSdnOrgKpi?: string | null;
  definition?: string | null;
  specificArea?: string | null;
  unitOfMeasure?: string | null;
  itemInMeasure?: string | null;
  disaggregationId?: string | null;
  baseLineDate?: Date | null;
  cumulativeValue?: number | null;
  baselineNarrative?: string | null;
  targetDate?: Date | null;
  cumulativeTarget?: number | null;
  targetNarrative?: string | null;
  targetType?: string | null;
  responsiblePersons?: string | null;
  result?: string | null;
  resultTypeId?: string | null;
  createAt?: Date | null;
  updateAt?: Date | null;
  impactId?: string | null;
}

export interface IIndicatorView {
  indicatorId: string;
  indicatorSource?: string | null;
  thematicAreasOrPillar?: string | null;
  statement?: string | null;
  linkKpiToSdnOrgKpi?: string | null;
  definition?: string | null;
  specificArea?: string | null;
  unitOfMeasure?: string | null;
  itemInMeasure?: string | null;
  disaggregationId?: string | null;
  disaggregationName?: string | null;
  baseLineDate?: Date | null;
  cumulativeValue?: number | null;
  baselineNarrative?: string | null;
  targetDate?: Date | null;
  cumulativeTarget?: number | null;
  targetNarrative?: string | null;
  targetType?: string | null;
  responsiblePersons?: string | null;
  createAt?: Date;
  updateAt?: Date;
  resultTypeId?: string | null;
  resultName?: string | null;
  result?: string | null;

  // From related Impact
  resultStatement?: string | null;
  resultThematicArea?: string | null;
  resultResponsiblePerson?: string | null;
  resultProjectId?: string | null;
}

export interface IIndicatorReport {
  indicatorReportId: string;
  indicatorSource?: string | null;
  thematicAreasOrPillar?: string | null;
  indicatorStatement?: string | null;
  responsiblePersons?: string | null;
  disaggregationId?: string | null;
  actualDate?: Date | null;
  cumulativeActual?: string | null;
  actualNarrative?: string | null;
  attachmentUrl?: string | null;
  status?: string | null;
  createAt?: Date | null;
  updateAt?: Date | null;
  indicatorId?: string | null;
  resultTypeId?: string | null;
}

export interface IIndicatorReportView {
  indicatorReportId: string;
  indicatorSource?: string | null;
  thematicAreasOrPillar?: string | null;
  indicatorStatement?: string | null;
  responsiblePersons?: string | null;
  disaggregationId?: string | null;
  disaggregationName?: string | null;
  actualDate?: Date | null;
  cumulativeActual?: string | null;
  actualNarrative?: string | null;
  attachmentUrl?: string | null;
  status?: string | null;
  createAt?: Date | null;
  updateAt?: Date | null;
  indicatorId?: string | null;
  result?: string | null;
  resultProjectId?: string | null;
  resultTypeId?: string | null;
  resultName?: string | null;
}

// OutcomeIndicator interfaces
export interface IOutcome {
  outcomeId: string;
  outcomeStatement: string;
  outcomeType: string;
  impactId?: string | null;
  thematicAreas?: string | null;
  responsiblePerson: string;
  projectId?: string | null;
  resultTypeId?: string | null;
  createAt?: Date | null;
  updateAt?: Date | null;
}

export interface IOutcomeView {
  outcomeId: string;
  outcomeStatement: string;
  outcomeType: string;
  impactId?: string | null;
  impactStatement?: string | null;
  thematicAreas?: string | null;
  responsiblePerson: string;
  projectId?: string | null;
  projectName?: string | null;
  resultTypeId?: string | null;
  resultName?: string | null;
  createAt?: Date | null;
  updateAt?: Date | null;
}

export interface IOutput {
  outputId: string;
  outputStatement: string;
  outcomeId?: string | null;
  thematicAreas?: string | null;
  responsiblePerson: string;
  projectId?: string | null;
  resultTypeId?: string | null;
  createAt?: Date;
  updateAt?: Date;
}
export interface IOutputView {
  outputId: string;
  outputStatement: string;
  outcomeId?: string | null;
  outcomeStatement?: string | null;
  thematicAreas?: string | null;
  responsiblePerson: string;
  projectId?: string | null;
  projectName?: string | null;
  resultTypeId?: string | null;
  resultName?: string | null;
  createAt?: Date | null;
  updateAt?: Date | null;
}

export interface IActivity {
  activityId: string;
  activityStatement?: string;
  outputId?: string;
  activityTotalBudget?: number;
  responsiblePerson?: string;
  startDate?: Date;
  endDate?: Date;
  activityFrequency?: number;
  subActivity?: string;
  descriptionAction?: string;
  deliveryDate?: Date;
  projectId?: string;
  createAt?: Date;
  updateAt?: Date;
}

export interface IActivityView {
  activityId: string;
  activityStatement?: string;
  outputId?: string;
  outputStatement?: string; // from Output table
  activityTotalBudget?: number;
  responsiblePerson?: string;
  startDate?: Date;
  endDate?: Date;
  activityFrequency?: number;
  subActivity?: string;
  descriptionAction?: string;
  deliveryDate?: Date;
  projectId?: string;
  projectName?: string; // from Project table
  createAt?: Date;
  updateAt?: Date;
}

export interface IActivityReport {
  activityReportId: string;
  activityId?: string | null;
  percentageCompletion?: number | null;
  actualStartDate?: Date | null;
  actualEndDate?: Date | null;
  actualCost?: number | null;
  actualNarrative?: string | null;
  createAt?: Date | null;
  updateAt?: Date | null;
}

export interface IActivityReportView {
  activityReportId: string;
  activityId?: string | null;
  activityStatement?: string | null;
  activityTotalBudget?: number | null;
  responsiblePerson?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  percentageCompletion?: number | null;
  actualStartDate?: Date | null;
  actualEndDate?: Date | null;
  actualCost?: number | null;
  actualNarrative?: string | null;
  createAt?: Date | null;
  updateAt?: Date | null;
}

export interface ILogicalFramework {
  logicalFrameworkId: string; // Unique identifier
  projectId?: string | null; // Optional project reference
  documentName?: string | null; // Name of the document
  documentURL?: string | null; // URL pointing to the document
  createAt?: Date | null; // Creation timestamp
  updateAt?: Date | null; // Last update timestamp
}

export interface ILogicalFrameworkView {
  logicalFrameworkId: string; // Unique identifier
  projectId?: string | null; // Project reference
  projectName?: string | null; // Project name (from join)
  documentName?: string | null; // Name of the document
  documentURL?: string | null; // URL to the document
  createAt?: Date | null; // Creation timestamp
  updateAt?: Date | null; // Last update timestamp
}

export interface IDisaggregation {
  disaggregationId?: string;
  disaggregationName?: string | null
}
export interface IGenderDisaggregation {
  genderDisaggregationId?: string;
  targetMale?: number | null;
  targetFemale?: number | null;
  actualMale?: number | null;
  actualFemale?: number | null;
  disaggregationId?: string | null;
  indicatorId?: string | null;
}
export interface IProductDisaggregation {
  productDisaggregationId?: string;
  productName?: string | null;
  targetCount?: number | null;
  actualCount?: number | null;
  disaggregationId?: string | null;
  indicatorId?: string | null;
}
export interface IDepartmentDisaggregation {
  departmentDisaggregationId?: string;
  departmentName?: string | null;
  targetCount?: number | null;
  actualCount?: number | null;
  disaggregationId?: string | null;
  indicatorId?: string | null;
}
export interface IStateDisaggregation {
  stateDisaggregationId?: string;
  stateName?: string | null;
  targetCount?: number | null;
  actualCount?: number | null;
  disaggregationId?: string | null;
  indicatorId?: string | null;
}
export interface ILgaDisaggregation {
  lgaDisaggregationId?: string;
  lgaName?: string | null;
  targetCount?: number | null;
  actualCount?: number | null;
  disaggregationId?: string | null;
  indicatorId?: string | null;
}
export interface ITenureDisaggregation {
  tenureDisaggregationId?: string;
  tenureName?: string | null;
  targetCount?: number | null;
  actualCount?: number | null;
  disaggregationId?: string | null;
  indicatorId?: string | null;
}
export interface IAgeDisaggregation {
  ageDisaggregationId?: string;
  targetFrom?: number | null;
  targetTo?: number | null;
  actualFrom?: number | null;
  actualTo?: number | null;
  disaggregationId?: string | null;
  indicatorId?: string | null;
}

export enum IReportStatus {
  pending = "PENDING",
  approve = "APPROVE",
  decline = "DECLINE",
}




