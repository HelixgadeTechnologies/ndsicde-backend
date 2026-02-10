"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFinancialDashboard = exports.getDetailedExpenses = exports.getBudgetVsActuals = exports.getProjectFinancialPerformance = exports.getExpenseBreakdown = exports.getBudgetTrends = exports.getFinancialSummary = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const categorizeExpense = (description) => {
    const desc = (description === null || description === void 0 ? void 0 : description.toLowerCase()) || "";
    if (desc.includes("salary") || desc.includes("staff") || desc.includes("consultant") || desc.includes("personnel")) {
        return "Personnel";
    }
    else if (desc.includes("equipment") || desc.includes("hardware") || desc.includes("software") || desc.includes("tools")) {
        return "Equipment";
    }
    else if (desc.includes("service") || desc.includes("maintenance") || desc.includes("subscription")) {
        return "Services";
    }
    else if (desc.includes("travel") || desc.includes("transport") || desc.includes("vehicle") || desc.includes("fuel")) {
        return "Travel";
    }
    else {
        return "Other";
    }
};
const buildDateFilter = (filter) => {
    const dateFilter = {};
    if (filter.startDate || filter.endDate) {
        dateFilter.createAt = {};
        if (filter.startDate)
            dateFilter.createAt.gte = new Date(filter.startDate);
        if (filter.endDate)
            dateFilter.createAt.lte = new Date(filter.endDate);
    }
    return dateFilter;
};
const getFinancialSummary = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filter = {}) {
    try {
        const dateFilter = buildDateFilter(filter);
        const projectFilter = filter.projectId ? { projectId: filter.projectId } : {};
        const projects = yield prisma.project.findMany({
            where: Object.assign(Object.assign({}, projectFilter), (filter.startDate || filter.endDate ? {
                createAt: dateFilter.createAt
            } : {})),
            select: {
                totalBudgetAmount: true,
            },
        });
        const totalBudgetAllocated = projects.reduce((sum, project) => {
            const budget = parseFloat(project.totalBudgetAmount || "0");
            return sum + budget;
        }, 0);
        const retirements = yield prisma.retirement.findMany({
            where: Object.assign(Object.assign({}, dateFilter), (filter.projectId ? {
                request: {
                    projectId: filter.projectId,
                },
            } : {})),
            select: {
                actualCost: true,
            },
        });
        const totalExpensesIncurred = retirements.reduce((sum, retirement) => {
            return sum + (retirement.actualCost || 0);
        }, 0);
        const budgetVariance = totalBudgetAllocated - totalExpensesIncurred;
        const budgetVariancePercentage = totalBudgetAllocated > 0
            ? (budgetVariance / totalBudgetAllocated) * 100
            : 0;
        let percentageFromLastPeriod = 0;
        if (filter.startDate && filter.endDate) {
            const start = new Date(filter.startDate);
            const end = new Date(filter.endDate);
            const duration = end.getTime() - start.getTime();
            const previousStart = new Date(start.getTime() - duration);
            const previousEnd = start;
            const previousRetirements = yield prisma.retirement.findMany({
                where: Object.assign({ createAt: {
                        gte: previousStart,
                        lt: previousEnd,
                    } }, (filter.projectId ? {
                    request: {
                        projectId: filter.projectId,
                    },
                } : {})),
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
    }
    catch (error) {
        console.error("Error in getFinancialSummary:", error);
        throw error;
    }
});
exports.getFinancialSummary = getFinancialSummary;
const getBudgetTrends = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filter = {}) {
    try {
        const dateFilter = buildDateFilter(filter);
        const projectFilter = filter.projectId ? { projectId: filter.projectId } : {};
        const requests = yield prisma.request.findMany({
            where: Object.assign(Object.assign({}, dateFilter), projectFilter),
            select: {
                total: true,
                createAt: true,
            },
        });
        const retirements = yield prisma.retirement.findMany({
            where: Object.assign(Object.assign({}, dateFilter), (filter.projectId ? {
                request: {
                    projectId: filter.projectId,
                },
            } : {})),
            select: {
                actualCost: true,
                createAt: true,
            },
        });
        const monthlyData = new Map();
        requests.forEach((request) => {
            if (request.createAt) {
                const date = new Date(request.createAt);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                if (!monthlyData.has(monthKey)) {
                    monthlyData.set(monthKey, { budget: 0, expenditure: 0, year: date.getFullYear() });
                }
                const data = monthlyData.get(monthKey);
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
                const data = monthlyData.get(monthKey);
                data.expenditure += retirement.actualCost || 0;
            }
        });
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const trends = [];
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
    }
    catch (error) {
        console.error("Error in getBudgetTrends:", error);
        throw error;
    }
});
exports.getBudgetTrends = getBudgetTrends;
const getExpenseBreakdown = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filter = {}) {
    try {
        const dateFilter = buildDateFilter(filter);
        const retirements = yield prisma.retirement.findMany({
            where: Object.assign(Object.assign({}, dateFilter), (filter.projectId ? {
                request: {
                    projectId: filter.projectId,
                },
            } : {})),
            select: {
                actualCost: true,
                activityLineDescription: true,
            },
        });
        const categoryTotals = new Map();
        let totalExpenses = 0;
        retirements.forEach((retirement) => {
            const category = categorizeExpense(retirement.activityLineDescription || "");
            const amount = retirement.actualCost || 0;
            categoryTotals.set(category, (categoryTotals.get(category) || 0) + amount);
            totalExpenses += amount;
        });
        const breakdown = Array.from(categoryTotals.entries()).map(([category, amount]) => ({
            category,
            amount: Number(amount.toFixed(2)),
            percentage: totalExpenses > 0 ? Number(((amount / totalExpenses) * 100).toFixed(2)) : 0,
        }));
        breakdown.sort((a, b) => b.amount - a.amount);
        return breakdown;
    }
    catch (error) {
        console.error("Error in getExpenseBreakdown:", error);
        throw error;
    }
});
exports.getExpenseBreakdown = getExpenseBreakdown;
const getProjectFinancialPerformance = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filter = {}) {
    try {
        const projectFilter = filter.projectId ? { projectId: filter.projectId } : {};
        const dateFilter = buildDateFilter(filter);
        const projects = yield prisma.project.findMany({
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
        const performance = projects.map((project) => {
            const approvedBudget = parseFloat(project.totalBudgetAmount || "0");
            const actualExpenses = project.request.reduce((sum, req) => {
                const reqExpenses = req.retirement.reduce((reqSum, r) => reqSum + (r.actualCost || 0), 0);
                return sum + reqExpenses;
            }, 0);
            const variance = approvedBudget - actualExpenses;
            const variancePercentage = approvedBudget > 0 ? (variance / approvedBudget) * 100 : 0;
            let status;
            if (actualExpenses === 0) {
                status = "No Spending";
            }
            else if (actualExpenses < approvedBudget * 0.95) {
                status = "Under Budget";
            }
            else if (actualExpenses > approvedBudget * 1.05) {
                status = "Over Budget";
            }
            else {
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
    }
    catch (error) {
        console.error("Error in getProjectFinancialPerformance:", error);
        throw error;
    }
});
exports.getProjectFinancialPerformance = getProjectFinancialPerformance;
const getBudgetVsActuals = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filter = {}) {
    try {
        const projectFilter = filter.projectId ? { projectId: filter.projectId } : {};
        const dateFilter = buildDateFilter(filter);
        const projects = yield prisma.project.findMany({
            where: projectFilter,
            select: {
                projectId: true,
                projectName: true,
                request: {
                    where: Object.assign({}, dateFilter),
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
        const budgetVsActuals = projects.map((project) => {
            const approvedExpenses = project.request
                .filter(r => r.status === "Approved")
                .reduce((sum, r) => sum + (r.total || 0), 0);
            const actualExpenses = project.request.reduce((sum, req) => {
                const reqExpenses = req.retirement.reduce((reqSum, r) => reqSum + (r.actualCost || 0), 0);
                return sum + reqExpenses;
            }, 0);
            const varianceAmount = approvedExpenses - actualExpenses;
            const variancePercentage = approvedExpenses > 0 ? (varianceAmount / approvedExpenses) * 100 : 0;
            let status;
            if (actualExpenses < approvedExpenses * 0.95) {
                status = "Under Budget";
            }
            else if (actualExpenses > approvedExpenses * 1.05) {
                status = "Over Budget";
            }
            else {
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
    }
    catch (error) {
        console.error("Error in getBudgetVsActuals:", error);
        throw error;
    }
});
exports.getBudgetVsActuals = getBudgetVsActuals;
const getDetailedExpenses = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filter = {}) {
    try {
        const dateFilter = buildDateFilter(filter);
        const retirements = yield prisma.retirement.findMany({
            where: Object.assign(Object.assign({}, dateFilter), (filter.projectId ? {
                request: {
                    projectId: filter.projectId,
                },
            } : {})),
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
        const transactions = retirements.map((retirement) => {
            var _a, _b, _c;
            return ({
                transactionId: retirement.retirementId,
                projectId: ((_a = retirement.request) === null || _a === void 0 ? void 0 : _a.projectId) || "N/A",
                projectName: ((_c = (_b = retirement.request) === null || _b === void 0 ? void 0 : _b.project) === null || _c === void 0 ? void 0 : _c.projectName) || "N/A",
                date: retirement.createAt || new Date(),
                category: categorizeExpense(retirement.activityLineDescription || ""),
                amount: retirement.actualCost || 0,
                description: retirement.activityLineDescription || "No description",
                receipt: retirement.documentURL || undefined,
                type: "Retirement",
            });
        });
        return transactions;
    }
    catch (error) {
        console.error("Error in getDetailedExpenses:", error);
        throw error;
    }
});
exports.getDetailedExpenses = getDetailedExpenses;
const getFinancialDashboard = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filter = {}) {
    try {
        const [summary, budgetTrends, expenseBreakdown, projectPerformance, budgetVsActuals, detailedExpenses,] = yield Promise.all([
            (0, exports.getFinancialSummary)(filter),
            (0, exports.getBudgetTrends)(filter),
            (0, exports.getExpenseBreakdown)(filter),
            (0, exports.getProjectFinancialPerformance)(filter),
            (0, exports.getBudgetVsActuals)(filter),
            (0, exports.getDetailedExpenses)(filter),
        ]);
        return {
            summary,
            budgetTrends,
            expenseBreakdown,
            projectPerformance,
            budgetVsActuals,
            detailedExpenses,
        };
    }
    catch (error) {
        console.error("Error in getFinancialDashboard:", error);
        throw error;
    }
});
exports.getFinancialDashboard = getFinancialDashboard;
