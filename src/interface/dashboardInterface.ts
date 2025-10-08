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