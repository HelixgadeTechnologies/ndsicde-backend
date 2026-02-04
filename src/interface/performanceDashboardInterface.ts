// Performance Dashboard Interfaces

// Date range filter interface
export interface IDateRangeFilter {
    startDate?: string;
    endDate?: string;
    projectId?: string;
    thematicArea?: string;
    resultType?: string; // "Impact" | "Outcome" | "Output"
}

// Performance Summary Metrics
export interface IPerformanceSummary {
    totalActiveProjects: number;
    completedKPIsPercentage: number;
    pendingRequests: number;
    budgetUtilization: number;
    projectHealthScore: number;
    percentageFromLastPeriod: number;
}

// KPI Actuals vs Targets
export interface IKpiActualVsTarget {
    period: string; // "Quarter 1", "Quarter 2", etc.
    year: number;
    kpiName?: string;
    resultType?: string;
    actual: number;
    target: number;
    achievementPercentage: number;
}

// Project Status Distribution
export interface IProjectStatusDistribution {
    status: "On Track" | "Delays" | "At Risk";
    count: number;
    percentage: number;
}

// Progress Tracking
export interface IProgressTracking {
    activity: {
        percentage: number;
        status: string;
    };
    output: {
        percentage: number;
        status: string;
    };
    outcomes: {
        percentage: number;
        status: string;
    };
    impact: {
        percentage: number;
        status: string;
    };
}

// Individual Project Performance Detail
export interface IProjectPerformanceDetail {
    projectId: string;
    projectName: string;
    status: string;
    startDate: Date | null;
    endDate: Date | null;
    totalBudget: number;
    budgetUtilization: number;
    healthScore: number;
    indicators: {
        total: number;
        achieved: number;
        pending: number;
        achievementRate: number;
    };
    activities: {
        total: number;
        completed: number;
        completionRate: number;
    };
    riskLevel: "Low" | "Medium" | "High";
}

// Complete Performance Dashboard Response
export interface IPerformanceDashboardResponse {
    summary: IPerformanceSummary;
    kpiActualsVsTargets: IKpiActualVsTarget[];
    statusDistribution: IProjectStatusDistribution[];
    progressTracking: IProgressTracking;
    projectDetails: IProjectPerformanceDetail[];
}
