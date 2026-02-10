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
exports.getDetailedExpensesController = exports.getBudgetVsActualsController = exports.getProjectFinancialPerformanceController = exports.getExpenseBreakdownController = exports.getBudgetTrendsController = exports.getFinancialSummaryController = exports.getFinancialDashboardController = void 0;
const financialDashboardService_1 = require("../service/financialDashboardService");
const getFinancialDashboardController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate, projectId } = req.query;
        const filter = {
            startDate: startDate,
            endDate: endDate,
            projectId: projectId,
        };
        const dashboard = yield (0, financialDashboardService_1.getFinancialDashboard)(filter);
        res.status(200).json({
            success: true,
            message: "Financial dashboard data retrieved successfully",
            data: dashboard,
        });
    }
    catch (error) {
        console.error("Error in getFinancialDashboardController:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve financial dashboard data",
        });
    }
});
exports.getFinancialDashboardController = getFinancialDashboardController;
const getFinancialSummaryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate, projectId } = req.query;
        const filter = {
            startDate: startDate,
            endDate: endDate,
            projectId: projectId,
        };
        const summary = yield (0, financialDashboardService_1.getFinancialSummary)(filter);
        res.status(200).json({
            success: true,
            message: "Financial summary retrieved successfully",
            data: summary,
        });
    }
    catch (error) {
        console.error("Error in getFinancialSummaryController:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve financial summary",
        });
    }
});
exports.getFinancialSummaryController = getFinancialSummaryController;
const getBudgetTrendsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate, projectId } = req.query;
        const filter = {
            startDate: startDate,
            endDate: endDate,
            projectId: projectId,
        };
        const trends = yield (0, financialDashboardService_1.getBudgetTrends)(filter);
        res.status(200).json({
            success: true,
            message: "Budget trends retrieved successfully",
            data: trends,
        });
    }
    catch (error) {
        console.error("Error in getBudgetTrendsController:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve budget trends",
        });
    }
});
exports.getBudgetTrendsController = getBudgetTrendsController;
const getExpenseBreakdownController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate, projectId } = req.query;
        const filter = {
            startDate: startDate,
            endDate: endDate,
            projectId: projectId,
        };
        const breakdown = yield (0, financialDashboardService_1.getExpenseBreakdown)(filter);
        res.status(200).json({
            success: true,
            message: "Expense breakdown retrieved successfully",
            data: breakdown,
        });
    }
    catch (error) {
        console.error("Error in getExpenseBreakdownController:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve expense breakdown",
        });
    }
});
exports.getExpenseBreakdownController = getExpenseBreakdownController;
const getProjectFinancialPerformanceController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate, projectId } = req.query;
        const filter = {
            startDate: startDate,
            endDate: endDate,
            projectId: projectId,
        };
        const performance = yield (0, financialDashboardService_1.getProjectFinancialPerformance)(filter);
        res.status(200).json({
            success: true,
            message: "Project financial performance retrieved successfully",
            data: performance,
        });
    }
    catch (error) {
        console.error("Error in getProjectFinancialPerformanceController:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve project financial performance",
        });
    }
});
exports.getProjectFinancialPerformanceController = getProjectFinancialPerformanceController;
const getBudgetVsActualsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate, projectId } = req.query;
        const filter = {
            startDate: startDate,
            endDate: endDate,
            projectId: projectId,
        };
        const budgetVsActuals = yield (0, financialDashboardService_1.getBudgetVsActuals)(filter);
        res.status(200).json({
            success: true,
            message: "Budget vs. actuals retrieved successfully",
            data: budgetVsActuals,
        });
    }
    catch (error) {
        console.error("Error in getBudgetVsActualsController:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve budget vs. actuals",
        });
    }
});
exports.getBudgetVsActualsController = getBudgetVsActualsController;
const getDetailedExpensesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate, projectId } = req.query;
        const filter = {
            startDate: startDate,
            endDate: endDate,
            projectId: projectId,
        };
        const expenses = yield (0, financialDashboardService_1.getDetailedExpenses)(filter);
        res.status(200).json({
            success: true,
            message: "Detailed expenses retrieved successfully",
            data: expenses,
        });
    }
    catch (error) {
        console.error("Error in getDetailedExpensesController:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve detailed expenses",
        });
    }
});
exports.getDetailedExpensesController = getDetailedExpensesController;
