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
import { asyncHandler } from "../middlewares/errorMiddleware";

const extractFilter = (query: any): IDateRangeFilter => ({
  startDate: query.startDate as string | undefined,
  endDate: query.endDate as string | undefined,
  projectId: query.projectId as string | undefined,
});

export const getFinancialDashboardController = asyncHandler(async (req, res) => {
  const dashboard = await getFinancialDashboard(extractFilter(req.query));
  res.status(200).json({ success: true, message: "Financial dashboard data retrieved successfully", data: dashboard });
});

export const getFinancialSummaryController = asyncHandler(async (req, res) => {
  const summary = await getFinancialSummary(extractFilter(req.query));
  res.status(200).json({ success: true, message: "Financial summary retrieved successfully", data: summary });
});

export const getBudgetTrendsController = asyncHandler(async (req, res) => {
  const trends = await getBudgetTrends(extractFilter(req.query));
  res.status(200).json({ success: true, message: "Budget trends retrieved successfully", data: trends });
});

export const getExpenseBreakdownController = asyncHandler(async (req, res) => {
  const breakdown = await getExpenseBreakdown(extractFilter(req.query));
  res.status(200).json({ success: true, message: "Expense breakdown retrieved successfully", data: breakdown });
});

export const getProjectFinancialPerformanceController = asyncHandler(async (req, res) => {
  const performance = await getProjectFinancialPerformance(extractFilter(req.query));
  res.status(200).json({ success: true, message: "Project financial performance retrieved successfully", data: performance });
});

export const getBudgetVsActualsController = asyncHandler(async (req, res) => {
  const budgetVsActuals = await getBudgetVsActuals(extractFilter(req.query));
  res.status(200).json({ success: true, message: "Budget vs. actuals retrieved successfully", data: budgetVsActuals });
});

export const getDetailedExpensesController = asyncHandler(async (req, res) => {
  const expenses = await getDetailedExpenses(extractFilter(req.query));
  res.status(200).json({ success: true, message: "Detailed expenses retrieved successfully", data: expenses });
});
