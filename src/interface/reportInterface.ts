// Report Generation Interfaces

export interface ReportGenerationParams {
    reportType: 'Activity Summary' | 'Financial Overview' | 'Request Analysis' | 'Retirement Analysis';
    reportName?: string;
    projectId?: string;
    startDate?: Date | string;
    endDate?: Date | string;
    selectedMetrics?: string[]; // e.g., ['budgetUtilization', 'completionRate', 'requestApprovalRate']
    generatedBy?: string;
}

export interface ReportData {
    summary: ReportSummary;
    charts: ChartData[];
    tables: TableData[];
    metadata: ReportMetadata;
}

export interface ReportSummary {
    totalActivities: number;
    completedActivities: number;
    totalRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
    pendingRequests: number;
    totalRetirements: number;
    completedRetirements: number;
    totalBudget: number;
    actualCost: number;
    budgetUtilization: number;
    completionRate: number;
    approvalRate: number;
}

export interface ChartData {
    type: 'pie' | 'bar' | 'line' | 'doughnut';
    title: string;
    data: {
        labels: string[];
        values: number[];
        colors?: string[];
    };
}

export interface TableData {
    title: string;
    headers: string[];
    rows: (string | number)[][];
}

export interface ReportMetadata {
    reportName: string;
    reportType: string;
    generatedAt: Date;
    generatedBy?: string;
    projectName?: string;
    dateRange?: {
        startDate?: Date;
        endDate?: Date;
    };
    filters: {
        projectId?: string;
        startDate?: Date;
        endDate?: Date;
        selectedMetrics?: string[];
    };
}

// Activity-specific interfaces
export interface ActivityReportData {
    activityId: string;
    activityStatement: string;
    responsiblePerson: string;
    startDate: Date | null;
    endDate: Date | null;
    totalBudget: number;
    actualCost: number;
    percentageCompletion: number;
    status: 'Completed' | 'In Progress' | 'Not Started' | 'Delayed';
}

// Request-specific interfaces
export interface RequestReportData {
    requestId: string;
    activityTitle: string;
    staff: string;
    total: number;
    status: string;
    approvalLevels: {
        A: number | null;
        B: number | null;
        C: number | null;
        D: number | null;
        E: number | null;
    };
    createAt: Date;
}

// Retirement-specific interfaces
export interface RetirementReportData {
    retirementId: string;
    activityLineDescription: string;
    totalBudget: number;
    actualCost: number;
    variance: number;
    variancePercentage: number;
    status: string;
    createAt: Date;
}

// Aggregated data interfaces
export interface AggregatedActivityData {
    activities: ActivityReportData[];
    totalActivities: number;
    completedActivities: number;
    inProgressActivities: number;
    delayedActivities: number;
    totalBudget: number;
    totalActualCost: number;
    averageCompletion: number;
}

export interface AggregatedRequestData {
    requests: RequestReportData[];
    totalRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
    pendingRequests: number;
    totalAmount: number;
    approvalRateByLevel: {
        A: number;
        B: number;
        C: number;
        D: number;
        E: number;
    };
}

export interface AggregatedRetirementData {
    retirements: RetirementReportData[];
    totalRetirements: number;
    completedRetirements: number;
    pendingRetirements: number;
    totalBudget: number;
    totalActualCost: number;
    totalVariance: number;
    averageVariancePercentage: number;
}

// PDF Generation interfaces
export interface PDFGenerationOptions {
    reportData: ReportData;
    outputPath: string;
    includeCharts?: boolean;
    includeTables?: boolean;
    pageSize?: 'A4' | 'Letter';
    orientation?: 'portrait' | 'landscape';
}

export interface ChartImageData {
    title: string;
    imageBuffer: Buffer;
    width: number;
    height: number;
}
