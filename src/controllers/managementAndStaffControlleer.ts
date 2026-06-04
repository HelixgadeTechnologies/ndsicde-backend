import {
  createIndicatorReportCommentService,
  getAllIndicatorReportCommentsService,
  getAllIndicatorReportsService,
  getBudgetUtilizationService,
  getCommentsByIndicatorReportIdService,
  getDashboardSummaryService,
  getIndicatorReportOverviewService,
  getKpiPerformanceService,
  getProjectsService,
  getProjectStatusDistributionService,
} from "../service/managementAndStaffService";
import { errorResponse, notFoundResponse, successResponse } from "../utils/responseHandler";
import { changePassword } from "../service/authService";
import { asyncHandler } from "../middlewares/errorMiddleware";

export const getDashboardSummary = asyncHandler(async (_req, res) => {
  const result = await getDashboardSummaryService();
  if (!result) {
    return res.status(404).json(notFoundResponse("Dashboard summary not found", null));
  }
  return res.status(200).json(successResponse("Dashboard summary fetched successfully", result));
});

export const getKpiPerformance = asyncHandler(async (req, res) => {
  const year = Number(req.query.year) || new Date().getFullYear();
  const result = await getKpiPerformanceService(year);
  if (!result) {
    return res.status(404).json(notFoundResponse("KPI performance data not found", null));
  }
  return res.status(200).json(successResponse("KPI performance fetched successfully", result));
});

export const getProjects = asyncHandler(async (_req, res) => {
  const projects = await getProjectsService();
  if (!projects.length) {
    return res.status(404).json(notFoundResponse("Projects not found", null));
  }
  return res.status(200).json(successResponse("Projects fetched successfully", projects));
});

export const getProjectStatusDistribution = asyncHandler(async (_req, res) => {
  const result = await getProjectStatusDistributionService();
  if (!result.length) {
    return res.status(404).json(notFoundResponse("Project status data not found", null));
  }
  return res.status(200).json(successResponse("Project status distribution fetched successfully", result));
});

export const getBudgetUtilization = asyncHandler(async (_req, res) => {
  const result = await getBudgetUtilizationService();
  if (!result.length) {
    return res.status(404).json(notFoundResponse("Budget utilization data not found", null));
  }
  return res.status(200).json(successResponse("Budget utilization fetched successfully", result));
});

export const getAllIndicatorReports = asyncHandler(async (_req, res) => {
  const reports = await getAllIndicatorReportsService();
  if (!reports || reports.length === 0) {
    return res.status(404).json(notFoundResponse("No indicator reports found", []));
  }
  return res.status(200).json(successResponse("Indicator reports fetched successfully", reports));
});

export const createIndicatorReportCommentController = asyncHandler(async (req, res) => {
  const result = await createIndicatorReportCommentService(req.body);
  return res.status(201).json(successResponse("Comment created successfully", result));
});

export const getCommentsByIndicatorReportIdController = asyncHandler(async (req, res) => {
  const { indicatorReportId } = req.params;
  const comments = await getCommentsByIndicatorReportIdService(indicatorReportId);
  if (!comments.length) {
    return res.status(404).json(notFoundResponse("No comments found", null));
  }
  return res.status(200).json(successResponse("Comments fetched successfully", comments));
});

export const getAllIndicatorReportCommentsController = asyncHandler(async (_req, res) => {
  const comments = await getAllIndicatorReportCommentsService();
  if (!comments.length) {
    return res.status(404).json(notFoundResponse("No comments found", null));
  }
  return res.status(200).json(successResponse("Comments fetched successfully", comments));
});

export const changePasswordController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (!userId) {
    return res.status(404).json(notFoundResponse("User not found", null));
  }
  const result = await changePassword(userId, oldPassword, newPassword, confirmPassword);
  return res.status(200).json(successResponse(result.message, null));
});

export const getIndicatorReportOverviewController = asyncHandler(async (req, res) => {
  const { indicatorReportId } = req.params;
  const overview = await getIndicatorReportOverviewService(indicatorReportId);
  if (!overview) {
    return res.status(404).json(notFoundResponse("Indicator report not found", null));
  }
  return res.status(200).json(successResponse("Indicator report overview fetched successfully", overview));
});
