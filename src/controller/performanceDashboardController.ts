import {
  getPerformanceSummary,
  getKpiActualsVsTargets,
  getProjectStatusDistribution,
  getProgressTracking,
  getProjectPerformanceDetails,
  getPerformanceDashboard,
} from "../service/performanceDashboardService";
import { IDateRangeFilter } from "../interface/performanceDashboardInterface";
import { asyncHandler } from "../middlewares/errorMiddleware";

export const getPerformanceDashboardController = asyncHandler(async (req, res) => {
  const filter: IDateRangeFilter = {
    startDate: req.query.startDate as string,
    endDate: req.query.endDate as string,
    projectId: req.query.projectId as string,
    thematicArea: req.query.thematicArea as string,
    resultType: req.query.resultType as string,
  };
  const data = await getPerformanceDashboard(filter);
  res.status(200).json({ success: true, message: "Performance dashboard data retrieved successfully", data });
});

export const getPerformanceSummaryController = asyncHandler(async (req, res) => {
  const filter: IDateRangeFilter = {
    startDate: req.query.startDate as string,
    endDate: req.query.endDate as string,
    projectId: req.query.projectId as string,
  };
  const data = await getPerformanceSummary(filter);
  res.status(200).json({ success: true, message: "Performance summary retrieved successfully", data });
});

export const getKpiActualsVsTargetsController = asyncHandler(async (req, res) => {
  const filter: IDateRangeFilter = {
    startDate: req.query.startDate as string,
    endDate: req.query.endDate as string,
    projectId: req.query.projectId as string,
    thematicArea: req.query.thematicArea as string,
    resultType: req.query.resultType as string,
  };
  const data = await getKpiActualsVsTargets(filter);
  res.status(200).json({ success: true, message: "KPI actuals vs targets retrieved successfully", data });
});

export const getProjectStatusDistributionController = asyncHandler(async (req, res) => {
  const filter: IDateRangeFilter = { projectId: req.query.projectId as string };
  const data = await getProjectStatusDistribution(filter);
  res.status(200).json({ success: true, message: "Project status distribution retrieved successfully", data });
});

export const getProgressTrackingController = asyncHandler(async (req, res) => {
  const filter: IDateRangeFilter = { projectId: req.query.projectId as string };
  const data = await getProgressTracking(filter);
  res.status(200).json({ success: true, message: "Progress tracking data retrieved successfully", data });
});

export const getProjectPerformanceDetailsController = asyncHandler(async (req, res) => {
  const filter: IDateRangeFilter = { projectId: req.query.projectId as string };
  const data = await getProjectPerformanceDetails(filter);
  res.status(200).json({ success: true, message: "Project performance details retrieved successfully", data });
});
