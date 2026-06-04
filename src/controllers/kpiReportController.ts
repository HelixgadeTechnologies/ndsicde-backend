import {
  getKpiDashboardStats,
  getKpiPerformanceChart,
  getKpiTypeDistribution,
  getKpiRecentSubmissions,
  getAssignedKpiList,
} from "../service/kpiReportService";
import { asyncHandler } from "../middlewares/errorMiddleware";

export const getKpiDashboardStatsController = asyncHandler(async (req, res) => {
  const { userId, projectId } = req.query;
  const data = await getKpiDashboardStats(userId as string | undefined, projectId as string | undefined);
  res.status(200).json({ success: true, message: "Stats fetched", data });
});

export const getAssignedKpiListController = asyncHandler(async (req, res) => {
  const { userId, projectId, status, search, startDate, endDate } = req.query;
  const data = await getAssignedKpiList({
    userId: userId as string | undefined,
    projectId: projectId as string | undefined,
    status: status as string | undefined,
    search: search as string | undefined,
    startDate: startDate as string | undefined,
    endDate: endDate as string | undefined,
  });
  res.status(200).json({ success: true, message: "Assigned KPI list fetched", data });
});

export const getKpiPerformanceChartController = asyncHandler(async (req, res) => {
  const { projectId, startDate, endDate } = req.query;
  const data = await getKpiPerformanceChart({
    projectId: projectId as string | undefined,
    startDate: startDate as string | undefined,
    endDate: endDate as string | undefined,
  });
  res.status(200).json({ success: true, message: "Performance chart data fetched", data });
});

export const getKpiTypeDistributionController = asyncHandler(async (req, res) => {
  const { projectId, startDate, endDate } = req.query;
  const data = await getKpiTypeDistribution({
    projectId: projectId as string | undefined,
    startDate: startDate as string | undefined,
    endDate: endDate as string | undefined,
  });
  res.status(200).json({ success: true, message: "Type distribution fetched", data });
});

export const getKpiRecentSubmissionsController = asyncHandler(async (req, res) => {
  const { search, status, projectId, startDate, endDate } = req.query;
  const data = await getKpiRecentSubmissions({
    search: search as string | undefined,
    status: status as string | undefined,
    projectId: projectId as string | undefined,
    startDate: startDate as string | undefined,
    endDate: endDate as string | undefined,
  });
  res.status(200).json({ success: true, message: "Submissions fetched", data });
});
