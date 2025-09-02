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
  createAt?: Date;
  updateAt?: Date;
}

export interface IImpactIndicator {
  impactIndicatorId: string;
  indicatorSource?: string | null;
  thematicAreasOrPillar?: string | null;
  statement?: string | null;
  linkKpiToSdnOrgKpi?: string | null;
  definition?: string | null;
  specificArea?: string | null;
  unitOfMeasure?: string | null;
  itemInMeasure?: string | null;
  disaggregation?: string | null;
  baseLineDate?: Date | null;
  cumulativeValue?: string | null;
  baselineNarrative?: string | null;
  targetDate?: Date | null;
  cumulativeTarget?: string | null;
  targetNarrative?: string | null;
  targetType?: string | null;
  responsiblePersons?: string | null;
  createAt?: Date | null;
  updateAt?: Date | null;
  impactId?: string | null;
}

export interface IImpactIndicatorView {
  impactIndicatorId: string;
  indicatorSource?: string | null;
  thematicAreasOrPillar?: string | null;
  statement?: string | null;
  linkKpiToSdnOrgKpi?: string | null;
  definition?: string | null;
  specificArea?: string | null;
  unitOfMeasure?: string | null;
  itemInMeasure?: string | null;
  disaggregation?: string | null;
  baseLineDate?: Date | null;
  cumulativeValue?: string | null;
  baselineNarrative?: string | null;
  targetDate?: Date | null;
  cumulativeTarget?: string | null;
  targetNarrative?: string | null;
  targetType?: string | null;
  responsiblePersons?: string | null;
  createAt?: Date;
  updateAt?: Date;
  impactId?: string | null;

  // From related Impact
  impactStatement?: string | null;
  impactThematicArea?: string | null;
  impactResponsiblePerson?: string | null;
  projectId?: string | null;
}

export interface IImpactIndicatorReportFormat {
  impactIndicatorReportFormatId: string;
  indicatorSource?: string | null;
  thematicAreasOrPillar?: string | null;
  indicatorStatement?: string | null;
  responsiblePersons?: string | null;
  disaggregationType?: string | null;
  linkKpiToSdnOrgKpi?: string | null;
  definition?: string | null;
  specificArea?: string | null;
  unitOfMeasure?: string | null;
  itemInMeasure?: string | null;
  actualDate?: Date | null;
  cumulativeActual?: string | null;
  actualNarrative?: string | null;
  attachmentUrl?: string | null;
  createAt?: Date | null;
  updateAt?: Date | null;
  impactIndicatorId?: string | null;
}

export interface ImpactIndicatorReportFormatView {
  impactIndicatorReportFormatId: string;
  indicatorSource?: string | null;
  thematicAreasOrPillar?: string | null;
  indicatorStatement?: string | null;
  responsiblePersons?: string | null;
  disaggregationType?: string | null;
  linkKpiToSdnOrgKpi?: string | null;
  definition?: string | null;
  specificArea?: string | null;
  unitOfMeasure?: string | null;
  itemInMeasure?: string | null;
  actualDate?: Date | null;
  cumulativeActual?: string | null;
  actualNarrative?: string | null;
  attachmentUrl?: string | null;
  createAt?: Date | null;
  updateAt?: Date | null;
  impactIndicatorId?: string | null;

  // Fields from ImpactIndicator
  impactIndicatorStatement?: string | null;
  impactIndicatorDefinition?: string | null;
  impactIndicatorUnit?: string | null;
  impactIndicatorItem?: string | null;
  impactIndicatorBaseLine?: Date | null;
  impactIndicatorCumulativeValue?: string | null;
  impactIndicatorTargetDate?: Date | null;
  impactIndicatorCumulativeTarget?: string | null;
  impactIndicatorTargetType?: string | null;
  impactIndicatorResponsiblePersons?: string | null;
  impactId?: string | null;
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
  createAt?: Date | null;
  updateAt?: Date | null;
}

export interface IOutcomeIndicator {
  outcomeIndicatorId: string;
  indicatorSource?: string | null;
  thematicAreasOrPillar?: string | null;
  statement?: string | null;
  linkKpiToSdnOrgKpi?: string | null;
  definition?: string | null;
  specificArea?: string | null;
  unitOfMeasure?: string | null;
  itemInMeasure?: string | null;
  disaggregation?: string | null;
  baseLineDate?: Date | null;
  cumulativeValue?: string | null;
  baselineNarrative?: string | null;
  targetDate?: Date | null;
  cumulativeTarget?: string | null;
  targetNarrative?: string | null;
  targetType?: string | null;
  responsiblePersons?: string | null;
  createAt?: Date | null;
  updateAt?: Date | null;
  outcomeId?: string | null;
}

export interface IOutcomeIndicatorView {
  outcomeIndicatorId: string;
  indicatorSource?: string | null;
  thematicAreasOrPillar?: string | null;
  statement?: string | null;
  linkKpiToSdnOrgKpi?: string | null;
  definition?: string | null;
  specificArea?: string | null;
  unitOfMeasure?: string | null;
  itemInMeasure?: string | null;
  disaggregation?: string | null;
  baseLineDate?: Date | null;
  cumulativeValue?: string | null;
  baselineNarrative?: string | null;
  targetDate?: Date | null;
  cumulativeTarget?: string | null;
  targetNarrative?: string | null;
  targetType?: string | null;
  responsiblePersons?: string | null;
  createAt?: Date | null;
  updateAt?: Date | null;
  outcomeId?: string | null;

  // From joined Outcome
  outcomeStatement?: string | null;
  outcomeType?: string | null;
  outcomeResponsiblePerson?: string | null;
  projectId?: string | null;
}

export interface IOutcomeIndicatorReportFormat {
  outcomeIndicatorReportFormatId: string;
  indicatorSource?: string | null;
  thematicAreasOrPillar?: string | null;
  indicatorStatement?: string | null;
  responsiblePersons?: string | null;
  disaggregationType?: string | null;
  linkKpiToSdnOrgKpi?: string | null;
  definition?: string | null;
  specificArea?: string | null;
  unitOfMeasure?: string | null;
  itemInMeasure?: string | null;
  actualDate?: Date | null;
  cumulativeActual?: string | null;
  actualNarrative?: string | null;
  attachmentUrl?: string | null;
  createAt?: Date | null;
  updateAt?: Date | null;
  outcomeIndicatorId?: string | null;
}

export interface IOutcomeIndicatorReportFormatView {
  outcomeIndicatorReportFormatId: string;
  indicatorSource?: string;
  thematicAreasOrPillar?: string;
  indicatorStatement?: string;
  responsiblePersons?: string;
  disaggregationType?: string;
  linkKpiToSdnOrgKpi?: string;
  definition?: string;
  specificArea?: string;
  unitOfMeasure?: string;
  itemInMeasure?: string;
  actualDate?: Date;
  cumulativeActual?: string;
  actualNarrative?: string;
  attachmentUrl?: string;
  createAt?: Date;
  updateAt?: Date;
  outcomeIndicatorId?: string;

  // Fields coming from OutcomeIndicator
  outcomeStatement?: string;
  outcomeThematicArea?: string;
  outcomeResponsiblePersons?: string;
}

export interface IOutput {
  outputId: string;
  outputStatement: string;
  outcomeId?: string | null;
  thematicAreas?: string | null;
  responsiblePerson: string;
  projectId?: string | null;
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
  createAt?: Date | null;
  updateAt?: Date | null;
}

export interface IOutputIndicator {
  outputIndicatorId: string;
  indicatorSource?: string | null;
  thematicAreasOrPillar?: string | null;
  statement?: string | null;
  linkKpiToSdnOrgKpi?: string | null;
  definition?: string | null;
  specificArea?: string | null;
  unitOfMeasure?: string | null;
  itemInMeasure?: string | null;
  disaggregation?: string | null;
  baseLineDate?: Date | null;
  cumulativeValue?: string | null;
  baselineNarrative?: string | null;
  targetDate?: Date | null;
  cumulativeTarget?: string | null;
  targetNarrative?: string | null;
  targetType?: string | null;
  responsiblePersons?: string | null;
  createAt?: Date | null;
  updateAt?: Date | null;
  outputId?: string | null;
}

export interface IOutputIndicatorView {
  outputIndicatorId: string;
  indicatorSource?: string | null;
  thematicAreasOrPillar?: string | null;
  statement?: string | null;
  linkKpiToSdnOrgKpi?: string | null;
  definition?: string | null;
  specificArea?: string | null;
  unitOfMeasure?: string | null;
  itemInMeasure?: string | null;
  disaggregation?: string | null;
  baseLineDate?: Date | null;
  cumulativeValue?: string | null;
  baselineNarrative?: string | null;
  targetDate?: Date | null;
  cumulativeTarget?: string | null;
  targetNarrative?: string | null;
  targetType?: string | null;
  responsiblePersons?: string | null;
  createAt?: Date | null;
  updateAt?: Date | null;
  outputId?: string | null;

  // Fields from joined Output
  outputStatement?: string | null;
  outputResponsiblePerson?: string | null;
  outputThematicAreas?: string | null;
}

export interface IOutputIndicatorReportFormat {
  outputIndicatorReportFormatId: string;
  indicatorSource?: string | null;
  thematicAreasOrPillar?: string | null;
  indicatorStatement?: string | null;
  responsiblePersons?: string | null;
  disaggregationType?: string | null;
  actualDate?: Date | null;
  cumulativeActual?: string | null;
  actualNarrative?: string | null;
  attachmentUrl?: string | null;
  createAt?: Date | null;
  updateAt?: Date | null;
  outputIndicatorId?: string | null;
}

export interface IOutputIndicatorReportFormatView {
  outputIndicatorReportFormatId: string;
  indicatorSource?: string | null;
  thematicAreasOrPillar?: string | null;
  indicatorStatement?: string | null;
  responsiblePersons?: string | null;
  disaggregationType?: string | null;
  actualDate?: Date | null;
  cumulativeActual?: string | null;
  actualNarrative?: string | null;
  attachmentUrl?: string | null;
  createAt?: Date | null;
  updateAt?: Date | null;
  outputIndicatorId?: string | null;

  // From joined OutputIndicator
  outputIndicatorStatement?: string | null;
  outputIndicatorUnitOfMeasure?: string | null;
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
  outputStatement?: string;       // from Output table
  activityTotalBudget?: number;
  responsiblePerson?: string;
  startDate?: Date;
  endDate?: Date;
  activityFrequency?: number;
  subActivity?: string;
  descriptionAction?: string;
  deliveryDate?: Date;
  projectId?: string;
  projectName?: string;      // from Project table
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
  logicalFrameworkId: string;   // Unique identifier
  projectId?: string | null;    // Optional project reference
  documentName?: string | null; // Name of the document
  documentURL?: string | null;  // URL pointing to the document
  createAt?: Date | null;       // Creation timestamp
  updateAt?: Date | null;       // Last update timestamp
}

export interface ILogicalFrameworkView {
  logicalFrameworkId: string;   // Unique identifier
  projectId?: string | null;    // Project reference
  projectName?: string | null;  // Project name (from join)
  documentName?: string | null; // Name of the document
  documentURL?: string | null;  // URL to the document
  createAt?: Date | null;       // Creation timestamp
  updateAt?: Date | null;       // Last update timestamp
}

