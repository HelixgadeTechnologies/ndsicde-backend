// Financial Dashboard Interfaces

export interface IFinancialSummary {
    totalBudgetAllocated: number;
    totalExpensesIncurred: number;
    budgetVariance: number;
    budgetVariancePercentage: number;
    percentageFromLastPeriod?: number;
}

export interface IBudgetTrend {
    month: string; // e.g., "Jan", "Feb", "Mar"
    year: number;
    budget: number;
    expenditure: number;
}

export interface IExpenseCategory {
    category: string;
    amount: number;
    percentage: number;
    color?: string; // For frontend visualization
}

export interface IProjectFinancialPerformance {
    projectId: string;
    projectName: string;
    approvedBudget: number;
    actualExpenses: number;
    variance: number;
    variancePercentage: number;
    status: "Under Budget" | "On Budget" | "Over Budget" | "No Spending";
}

export interface IBudgetVsActual {
    projectId: string;
    projectName: string;
    approvedExpenses: number;
    actualExpenses: number;
    varianceAmount: number;
    variancePercentage: number;
    status: "Under Budget" | "Over Budget" | "On Track";
}

export interface IExpenseTransaction {
    transactionId: string;
    projectId: string;
    projectName: string;
    date: Date;
    category: string;
    amount: number;
    description: string;
    receipt?: string; // Document URL
    type: "Request" | "Retirement";
}

export interface IFinancialDashboardResponse {
    summary: IFinancialSummary;
    budgetTrends: IBudgetTrend[];
    expenseBreakdown: IExpenseCategory[];
    projectPerformance: IProjectFinancialPerformance[];
    budgetVsActuals: IBudgetVsActual[];
    detailedExpenses: IExpenseTransaction[];
}

export interface IDateRangeFilter {
    startDate?: string;
    endDate?: string;
    projectId?: string;
}
