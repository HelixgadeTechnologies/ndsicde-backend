import { Request, Response } from "express";
import {
    getFinancialDashboard,
    getFinancialSummary,
    getBudgetTrends,
    getExpenseBreakdown,
    getProjectFinancialPerformance,
    getBudgetVsActuals,
    getDetailedExpenses,
} from "../service/financialDashboardService";
import { IDateRangeFilter } from "../interface/financialDashboardInterface";

// ✅ Get Complete Financial Dashboard
export const getFinancialDashboardController = async (
    req: Request,
    res: Response
) => {
    try {
        const { startDate, endDate, projectId } = req.query;

        const filter: IDateRangeFilter = {
            startDate: startDate as string | undefined,
            endDate: endDate as string | undefined,
            projectId: projectId as string | undefined,
        };

        const dashboard = await getFinancialDashboard(filter);

        res.status(200).json({
            success: true,
            message: "Financial dashboard data retrieved successfully",
            data: dashboard,
        });
    } catch (error: any) {
        console.error("Error in getFinancialDashboardController:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve financial dashboard data",
        });
    }
};

// ✅ Get Financial Summary Only
export const getFinancialSummaryController = async (
    req: Request,
    res: Response
) => {
    try {
        const { startDate, endDate, projectId } = req.query;

        const filter: IDateRangeFilter = {
            startDate: startDate as string | undefined,
            endDate: endDate as string | undefined,
            projectId: projectId as string | undefined,
        };

        const summary = await getFinancialSummary(filter);

        res.status(200).json({
            success: true,
            message: "Financial summary retrieved successfully",
            data: summary,
        });
    } catch (error: any) {
        console.error("Error in getFinancialSummaryController:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve financial summary",
        });
    }
};

// ✅ Get Budget Trends Only
export const getBudgetTrendsController = async (
    req: Request,
    res: Response
) => {
    try {
        const { startDate, endDate, projectId } = req.query;

        const filter: IDateRangeFilter = {
            startDate: startDate as string | undefined,
            endDate: endDate as string | undefined,
            projectId: projectId as string | undefined,
        };

        const trends = await getBudgetTrends(filter);

        res.status(200).json({
            success: true,
            message: "Budget trends retrieved successfully",
            data: trends,
        });
    } catch (error: any) {
        console.error("Error in getBudgetTrendsController:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve budget trends",
        });
    }
};

// ✅ Get Expense Breakdown Only
export const getExpenseBreakdownController = async (
    req: Request,
    res: Response
) => {
    try {
        const { startDate, endDate, projectId } = req.query;

        const filter: IDateRangeFilter = {
            startDate: startDate as string | undefined,
            endDate: endDate as string | undefined,
            projectId: projectId as string | undefined,
        };

        const breakdown = await getExpenseBreakdown(filter);

        res.status(200).json({
            success: true,
            message: "Expense breakdown retrieved successfully",
            data: breakdown,
        });
    } catch (error: any) {
        console.error("Error in getExpenseBreakdownController:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve expense breakdown",
        });
    }
};

// ✅ Get Project Financial Performance Only
export const getProjectFinancialPerformanceController = async (
    req: Request,
    res: Response
) => {
    try {
        const { startDate, endDate, projectId } = req.query;

        const filter: IDateRangeFilter = {
            startDate: startDate as string | undefined,
            endDate: endDate as string | undefined,
            projectId: projectId as string | undefined,
        };

        const performance = await getProjectFinancialPerformance(filter);

        res.status(200).json({
            success: true,
            message: "Project financial performance retrieved successfully",
            data: performance,
        });
    } catch (error: any) {
        console.error("Error in getProjectFinancialPerformanceController:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve project financial performance",
        });
    }
};

// ✅ Get Budget vs. Actuals Only
export const getBudgetVsActualsController = async (
    req: Request,
    res: Response
) => {
    try {
        const { startDate, endDate, projectId } = req.query;

        const filter: IDateRangeFilter = {
            startDate: startDate as string | undefined,
            endDate: endDate as string | undefined,
            projectId: projectId as string | undefined,
        };

        const budgetVsActuals = await getBudgetVsActuals(filter);

        res.status(200).json({
            success: true,
            message: "Budget vs. actuals retrieved successfully",
            data: budgetVsActuals,
        });
    } catch (error: any) {
        console.error("Error in getBudgetVsActualsController:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve budget vs. actuals",
        });
    }
};

// ✅ Get Detailed Expenses Only
export const getDetailedExpensesController = async (
    req: Request,
    res: Response
) => {
    try {
        const { startDate, endDate, projectId } = req.query;

        const filter: IDateRangeFilter = {
            startDate: startDate as string | undefined,
            endDate: endDate as string | undefined,
            projectId: projectId as string | undefined,
        };

        const expenses = await getDetailedExpenses(filter);

        res.status(200).json({
            success: true,
            message: "Detailed expenses retrieved successfully",
            data: expenses,
        });
    } catch (error: any) {
        console.error("Error in getDetailedExpensesController:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve detailed expenses",
        });
    }
};
