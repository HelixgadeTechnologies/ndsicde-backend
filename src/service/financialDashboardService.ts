import { PrismaClient } from "@prisma/client";
import {
    IFinancialSummary,
    IBudgetTrend,
    IExpenseCategory,
    IProjectFinancialPerformance,
    IBudgetVsActual,
    IExpenseTransaction,
    IFinancialDashboardResponse,
    IDateRangeFilter,
} from "../interface/financialDashboardInterface";

const prisma = new PrismaClient();

// Helper function to categorize expenses
const categorizeExpense = (description: string): string => {
    const desc = description?.toLowerCase() || "";

    if (desc.includes("salary") || desc.includes("staff") || desc.includes("consultant") || desc.includes("personnel")) {
        return "Personnel";
    } else if (desc.includes("equipment") || desc.includes("hardware") || desc.includes("software") || desc.includes("tools")) {
        return "Equipment";
    } else if (desc.includes("service") || desc.includes("maintenance") || desc.includes("subscription")) {
        return "Services";
    } else if (desc.includes("travel") || desc.includes("transport") || desc.includes("vehicle") || desc.includes("fuel")) {
        return "Travel";
    } else {
        return "Other";
    }
};

// Helper function to build date filter
const buildDateFilter = (filter: IDateRangeFilter) => {
    const dateFilter: any = {};

    if (filter.startDate || filter.endDate) {
        dateFilter.createAt = {};
        if (filter.startDate) dateFilter.createAt.gte = new Date(filter.startDate);
        if (filter.endDate) dateFilter.createAt.lte = new Date(filter.endDate);
    }

    return dateFilter;
};

// ✅ Get Financial Summary
export const getFinancialSummary = async (
    filter: IDateRangeFilter = {}
): Promise<IFinancialSummary> => {
    try {
        const dateFilter = buildDateFilter(filter);
        const projectFilter = filter.projectId ? { projectId: filter.projectId } : {};

        // Get total budget allocated from projects
        const projects = await prisma.project.findMany({
            where: {
                ...projectFilter,
                ...(filter.startDate || filter.endDate ? {
                    createAt: dateFilter.createAt
                } : {}),
            },
            select: {
                totalBudgetAmount: true,
            },
        });

        const totalBudgetAllocated = projects.reduce((sum, project) => {
            const budget = parseFloat(project.totalBudgetAmount || "0");
            return sum + budget;
        }, 0);

        // Get total expenses from retirements
        const retirements = await prisma.retirement.findMany({
            where: {
                ...dateFilter,
                ...(filter.projectId ? {
                    request: {
                        projectId: filter.projectId,
                    },
                } : {}),
            },
            select: {
                actualCost: true,
            },
        });

        const totalExpensesIncurred = retirements.reduce((sum, retirement) => {
            return sum + (retirement.actualCost || 0);
        }, 0);

        // Calculate variance
        const budgetVariance = totalBudgetAllocated - totalExpensesIncurred;
        const budgetVariancePercentage = totalBudgetAllocated > 0
            ? (budgetVariance / totalBudgetAllocated) * 100
            : 0;

        // Calculate percentage from last period
        let percentageFromLastPeriod = 0;
        if (filter.startDate && filter.endDate) {
            const start = new Date(filter.startDate);
            const end = new Date(filter.endDate);
            const duration = end.getTime() - start.getTime();

            const previousStart = new Date(start.getTime() - duration);
            const previousEnd = start;

            const previousRetirements = await prisma.retirement.findMany({
                where: {
                    createAt: {
                        gte: previousStart,
                        lt: previousEnd,
                    },
                    ...(filter.projectId ? {
                        request: {
                            projectId: filter.projectId,
                        },
                    } : {}),
                },
                select: {
                    actualCost: true,
                },
            });

            const previousExpenses = previousRetirements.reduce((sum, r) => sum + (r.actualCost || 0), 0);

            if (previousExpenses > 0) {
                percentageFromLastPeriod = ((totalExpensesIncurred - previousExpenses) / previousExpenses) * 100;
            }
        }

        return {
            totalBudgetAllocated: Number(totalBudgetAllocated.toFixed(2)),
            totalExpensesIncurred: Number(totalExpensesIncurred.toFixed(2)),
            budgetVariance: Number(budgetVariance.toFixed(2)),
            budgetVariancePercentage: Number(budgetVariancePercentage.toFixed(2)),
            percentageFromLastPeriod: Number(percentageFromLastPeriod.toFixed(2)),
        };
    } catch (error) {
        console.error("Error in getFinancialSummary:", error);
        throw error;
    }
};

// ✅ Get Budget vs. Expenditure Trends (Monthly)
export const getBudgetTrends = async (
    filter: IDateRangeFilter = {}
): Promise<IBudgetTrend[]> => {
    try {
        const dateFilter = buildDateFilter(filter);
        const projectFilter = filter.projectId ? { projectId: filter.projectId } : {};

        // Get all requests with budget data
        const requests = await prisma.request.findMany({
            where: {
                ...dateFilter,
                ...projectFilter,
            },
            select: {
                total: true,
                createAt: true,
            },
        });

        // Get all retirements with actual expenses
        const retirements = await prisma.retirement.findMany({
            where: {
                ...dateFilter,
                ...(filter.projectId ? {
                    request: {
                        projectId: filter.projectId,
                    },
                } : {}),
            },
            select: {
                actualCost: true,
                createAt: true,
            },
        });

        // Group by month
        const monthlyData: Map<string, { budget: number; expenditure: number; year: number }> = new Map();

        requests.forEach((request) => {
            if (request.createAt) {
                const date = new Date(request.createAt);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

                if (!monthlyData.has(monthKey)) {
                    monthlyData.set(monthKey, { budget: 0, expenditure: 0, year: date.getFullYear() });
                }

                const data = monthlyData.get(monthKey)!;
                data.budget += request.total || 0;
            }
        });

        retirements.forEach((retirement) => {
            if (retirement.createAt) {
                const date = new Date(retirement.createAt);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

                if (!monthlyData.has(monthKey)) {
                    monthlyData.set(monthKey, { budget: 0, expenditure: 0, year: date.getFullYear() });
                }

                const data = monthlyData.get(monthKey)!;
                data.expenditure += retirement.actualCost || 0;
            }
        });

        // Convert to array and format
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const trends: IBudgetTrend[] = [];

        Array.from(monthlyData.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .forEach(([key, data]) => {
                const [year, month] = key.split('-');
                trends.push({
                    month: monthNames[parseInt(month) - 1],
                    year: data.year,
                    budget: Number(data.budget.toFixed(2)),
                    expenditure: Number(data.expenditure.toFixed(2)),
                });
            });

        return trends;
    } catch (error) {
        console.error("Error in getBudgetTrends:", error);
        throw error;
    }
};

// ✅ Get Expense Breakdown by Category
export const getExpenseBreakdown = async (
    filter: IDateRangeFilter = {}
): Promise<IExpenseCategory[]> => {
    try {
        const dateFilter = buildDateFilter(filter);

        // Get all retirements with descriptions
        const retirements = await prisma.retirement.findMany({
            where: {
                ...dateFilter,
                ...(filter.projectId ? {
                    request: {
                        projectId: filter.projectId,
                    },
                } : {}),
            },
            select: {
                actualCost: true,
                activityLineDescription: true,
            },
        });

        // Categorize and sum
        const categoryTotals: Map<string, number> = new Map();
        let totalExpenses = 0;

        retirements.forEach((retirement) => {
            const category = categorizeExpense(retirement.activityLineDescription || "");
            const amount = retirement.actualCost || 0;

            categoryTotals.set(category, (categoryTotals.get(category) || 0) + amount);
            totalExpenses += amount;
        });

        // Convert to array with percentages
        const breakdown: IExpenseCategory[] = Array.from(categoryTotals.entries()).map(([category, amount]) => ({
            category,
            amount: Number(amount.toFixed(2)),
            percentage: totalExpenses > 0 ? Number(((amount / totalExpenses) * 100).toFixed(2)) : 0,
        }));

        // Sort by amount descending
        breakdown.sort((a, b) => b.amount - a.amount);

        return breakdown;
    } catch (error) {
        console.error("Error in getExpenseBreakdown:", error);
        throw error;
    }
};

// ✅ Get Project Financial Performance
export const getProjectFinancialPerformance = async (
    filter: IDateRangeFilter = {}
): Promise<IProjectFinancialPerformance[]> => {
    try {
        const projectFilter = filter.projectId ? { projectId: filter.projectId } : {};
        const dateFilter = buildDateFilter(filter);

        // Get all projects with their budgets
        const projects = await prisma.project.findMany({
            where: projectFilter,
            select: {
                projectId: true,
                projectName: true,
                totalBudgetAmount: true,
                request: {
                    select: {
                        retirement: {
                            where: dateFilter,
                            select: {
                                actualCost: true,
                            },
                        },
                    },
                },
            },
        });

        const performance: IProjectFinancialPerformance[] = projects.map((project) => {
            const approvedBudget = parseFloat(project.totalBudgetAmount || "0");

            // Calculate actual expenses from all retirements across all requests
            const actualExpenses = project.request.reduce((sum, req) => {
                const reqExpenses = req.retirement.reduce((reqSum, r) => reqSum + (r.actualCost || 0), 0);
                return sum + reqExpenses;
            }, 0);

            const variance = approvedBudget - actualExpenses;
            const variancePercentage = approvedBudget > 0 ? (variance / approvedBudget) * 100 : 0;

            let status: "Under Budget" | "On Budget" | "Over Budget" | "No Spending";
            if (actualExpenses === 0) {
                status = "No Spending";
            } else if (actualExpenses < approvedBudget * 0.95) {
                status = "Under Budget";
            } else if (actualExpenses > approvedBudget * 1.05) {
                status = "Over Budget";
            } else {
                status = "On Budget";
            }

            return {
                projectId: project.projectId,
                projectName: project.projectName || "Unnamed Project",
                approvedBudget: Number(approvedBudget.toFixed(2)),
                actualExpenses: Number(actualExpenses.toFixed(2)),
                variance: Number(variance.toFixed(2)),
                variancePercentage: Number(variancePercentage.toFixed(2)),
                status,
            };
        });

        return performance;
    } catch (error) {
        console.error("Error in getProjectFinancialPerformance:", error);
        throw error;
    }
};

// ✅ Get Budget vs. Actuals
export const getBudgetVsActuals = async (
    filter: IDateRangeFilter = {}
): Promise<IBudgetVsActual[]> => {
    try {
        const projectFilter = filter.projectId ? { projectId: filter.projectId } : {};
        const dateFilter = buildDateFilter(filter);

        // Get projects with approved requests and actual retirements
        const projects = await prisma.project.findMany({
            where: projectFilter,
            select: {
                projectId: true,
                projectName: true,
                request: {
                    where: {
                        ...dateFilter,
                    },
                    select: {
                        total: true,
                        status: true,
                        retirement: {
                            where: dateFilter,
                            select: {
                                actualCost: true,
                            },
                        },
                    },
                },
            },
        });

        const budgetVsActuals: IBudgetVsActual[] = projects.map((project) => {
            // Only sum approved requests
            const approvedExpenses = project.request
                .filter(r => r.status === "Approved")
                .reduce((sum, r) => sum + (r.total || 0), 0);

            // Calculate actual expenses from all retirements across all requests
            const actualExpenses = project.request.reduce((sum, req) => {
                const reqExpenses = req.retirement.reduce((reqSum, r) => reqSum + (r.actualCost || 0), 0);
                return sum + reqExpenses;
            }, 0);

            const varianceAmount = approvedExpenses - actualExpenses;
            const variancePercentage = approvedExpenses > 0 ? (varianceAmount / approvedExpenses) * 100 : 0;

            let status: "Under Budget" | "Over Budget" | "On Track";
            if (actualExpenses < approvedExpenses * 0.95) {
                status = "Under Budget";
            } else if (actualExpenses > approvedExpenses * 1.05) {
                status = "Over Budget";
            } else {
                status = "On Track";
            }

            return {
                projectId: project.projectId,
                projectName: project.projectName || "Unnamed Project",
                approvedExpenses: Number(approvedExpenses.toFixed(2)),
                actualExpenses: Number(actualExpenses.toFixed(2)),
                varianceAmount: Number(varianceAmount.toFixed(2)),
                variancePercentage: Number(variancePercentage.toFixed(2)),
                status,
            };
        });

        return budgetVsActuals;
    } catch (error) {
        console.error("Error in getBudgetVsActuals:", error);
        throw error;
    }
};

// ✅ Get Detailed Expense Transactions
export const getDetailedExpenses = async (
    filter: IDateRangeFilter = {}
): Promise<IExpenseTransaction[]> => {
    try {
        const dateFilter = buildDateFilter(filter);

        // Get retirements with related data
        const retirements = await prisma.retirement.findMany({
            where: {
                ...dateFilter,
                ...(filter.projectId ? {
                    request: {
                        projectId: filter.projectId,
                    },
                } : {}),
            },
            include: {
                request: {
                    select: {
                        projectId: true,
                        project: {
                            select: {
                                projectName: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createAt: 'desc',
            },
        });

        const transactions: IExpenseTransaction[] = retirements.map((retirement) => ({
            transactionId: retirement.retirementId,
            projectId: retirement.request?.projectId || "N/A",
            projectName: retirement.request?.project?.projectName || "N/A",
            date: retirement.createAt || new Date(),
            category: categorizeExpense(retirement.activityLineDescription || ""),
            amount: retirement.actualCost || 0,
            description: retirement.activityLineDescription || "No description",
            receipt: retirement.documentURL || undefined,
            type: "Retirement",
        }));

        return transactions;
    } catch (error) {
        console.error("Error in getDetailedExpenses:", error);
        throw error;
    }
};

// ✅ Get Complete Financial Dashboard
export const getFinancialDashboard = async (
    filter: IDateRangeFilter = {}
): Promise<IFinancialDashboardResponse> => {
    try {
        const [
            summary,
            budgetTrends,
            expenseBreakdown,
            projectPerformance,
            budgetVsActuals,
            detailedExpenses,
        ] = await Promise.all([
            getFinancialSummary(filter),
            getBudgetTrends(filter),
            getExpenseBreakdown(filter),
            getProjectFinancialPerformance(filter),
            getBudgetVsActuals(filter),
            getDetailedExpenses(filter),
        ]);

        return {
            summary,
            budgetTrends,
            expenseBreakdown,
            projectPerformance,
            budgetVsActuals,
            detailedExpenses,
        };
    } catch (error) {
        console.error("Error in getFinancialDashboard:", error);
        throw error;
    }
};
