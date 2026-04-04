export interface IActivityDashboard {
  activityId?: string;
  outputId?:string;
  projectId?:string;
  activityStatement?: string;
  activityPlannedStartDate?: Date;
  activityPlannedEndDate?: Date;
  activityActualStartDate?: Date;
  activityActualEndDate?: Date;
  activityCompletionRate?: number;
  budgetAtCompletion?: number;
  actualCost?: number;
  totalActivityPlannedDays?: number;
  totalActivitySpentDays?: number;
  daysVariance?: number;
  percentageDaysSpent?: number;
  earnedValue?: number;
  plannedValue?: number;
  costVariance?: number;
  scheduleVariance?: number;
  costPerformanceIndex?: number;
  schedulePerformanceIndex?: number;
  burnRate?: string;
  costPerformanceStatus?: string;
  schedulePerformanceStatus?: string;
  implementationTimeAnalysis?: string;
}

export interface ProjectBudgetPerformanceSummaryView {
  totalProjects: number | null;
  underBudgetProjects: number | null;
  underBudgetPercentage: number | null;
  overBudgetProjects: number | null;
  overBudgetPercentage: number | null;
  onBudgetProjects: number | null;
  onBudgetPercentage: number | null;
}


export interface IImplementationTimeAnalysisView{
  projectId?:string;
  implementationTimeAnalysis?:string;
  totalActivities?:number;
  percentage?:number;
}

export interface IKpiDashboardData {
    projectId: string,
    resultTypeId: string,
    disaggregationId: string,
    data: void | any[]
}
export interface IKpiDashboardOutput {
    INDICATOR_STATUS: void | any[],
    INDICATOR_DATA: Array<IKpiDashboardData>,
    AVERAGE_INDICATOR_PERFORMANCE: void | any[],
    INDICATOR_PERFORMANCE: void | any[],
}

// ─── Activity Table Row (Block 2 – Table tab) ─────────────────────────────────
export interface IActivityTableRow {
  activityId: string;
  activityStatement: string;
  /** Planned number of reports / cycles for this activity */
  targetFrequency: number;
  /** Actual number of ActivityReport records submitted */
  actualFrequency: number;
  /** percentageCompletion from the latest ActivityReport */
  performance: number;
  /** implementationTimeAnalysis label (e.g. "Due to Start", "In Progress (Early Start)") */
  status: string;
}

// ─── Activity Overview Item (Block 2 – Pie chart) ────────────────────────────
export interface IActivityOverviewItem {
  category: string;
  count: number;
  percentage: number;
}

// ─── Result Summary (Block 1 – Top cards) ────────────────────────────────────
export interface IResultSummary {
  resultAndActivities: {
    totalImpacts: number;
    totalOutcomes: number;
    totalOutputs: number;
    totalActivities: number;
  };
  kpisDueForReporting: {
    /** Indicators with result type "Impact" that have zero IndicatorReports */
    impacts: number;
    /** Indicators with result type "Outcome" that have zero IndicatorReports */
    outcomes: number;
    /** Indicators with result type "Output" that have zero IndicatorReports */
    outputs: number;
  };
  overallPerformance: {
    /** Average achievement % for Impact-level indicators */
    impacts: number;
    /** Average achievement % for Outcome-level indicators */
    outcomes: number;
    /** Average achievement % for Output-level indicators */
    outputs: number;
    /** Average achievement % across all indicators */
    totalActivity: number;
  };
}

// ─── Combined Result Dashboard Full response ──────────────────────────────────
export interface IResultDashboardFullOutput {
  RESULT_SUMMARY: IResultSummary;
  ACTIVITY_OVERVIEW: IActivityOverviewItem[];
  ACTIVITY_TABLE: IActivityTableRow[];
}