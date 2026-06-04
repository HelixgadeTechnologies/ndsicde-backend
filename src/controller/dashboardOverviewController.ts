import {
  getDashboardStats,
  getRecentActivities,
  getPendingActivityFundRequests,
  getPendingReportApprovals,
} from "../service/dashboardOverviewService";
import { asyncHandler } from "../middlewares/errorMiddleware";

export const getDashboardStatsController = asyncHandler(async (_req, res) => {
  const stats = await getDashboardStats();
  res.status(200).json({ success: true, message: "Dashboard statistics retrieved successfully", data: stats });
});

export const getRecentActivitiesController = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
  const projectId = req.query.projectId as string | undefined;
  const days = req.query.days ? parseInt(req.query.days as string) : undefined;
  const activities = await getRecentActivities({ limit, projectId, days });
  res.status(200).json({ success: true, message: "Recent activities retrieved successfully", data: activities });
});

export const getPendingFundRequestsController = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
  const requests = await getPendingActivityFundRequests(limit);
  res.status(200).json({ success: true, message: "Pending fund requests retrieved successfully", data: requests });
});

export const getPendingReportApprovalsController = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
  const approvals = await getPendingReportApprovals(limit);
  res.status(200).json({ success: true, message: "Pending report approvals retrieved successfully", data: approvals });
});

export const getDashboardOverviewController = asyncHandler(async (req, res) => {
  const projectId = req.query.projectId as string | undefined;
  const [stats, recentActivities, pendingRequests, pendingApprovals] = await Promise.all([
    getDashboardStats(),
    getRecentActivities({ limit: 10, projectId }),
    getPendingActivityFundRequests(5),
    getPendingReportApprovals(5),
  ]);
  res.status(200).json({
    success: true,
    message: "Dashboard overview retrieved successfully",
    data: { stats, recentActivities, pendingFundRequests: pendingRequests, pendingReportApprovals: pendingApprovals },
  });
});
