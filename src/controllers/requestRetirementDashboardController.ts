import {
  getRequestRetirementDashboardStats,
  getActivityFinancialList,
  ActivityListFilters,
} from "../service/requestRetirementDashboardService";
import { asyncHandler } from "../middlewares/errorMiddleware";

export const getDashboardStatsController = asyncHandler(async (_req, res) => {
  const data = await getRequestRetirementDashboardStats();
  res.status(200).json({ success: true, message: "Dashboard stats fetched successfully", data });
});

export const getActivityFinancialListController = asyncHandler(async (req, res) => {
  const { type, search, status, projectId, startDate, endDate } = req.query;
  if (!type || (type !== "request" && type !== "retirement")) {
    return res.status(400).json({ success: false, message: "Query param `type` must be either 'request' or 'retirement'" });
  }
  const filters: ActivityListFilters = {
    type: type as "request" | "retirement",
    search: search as string | undefined,
    status: status as string | undefined,
    projectId: projectId as string | undefined,
    startDate: startDate as string | undefined,
    endDate: endDate as string | undefined,
  };
  const data = await getActivityFinancialList(filters);
  res.status(200).json({ success: true, message: "Activity financial list fetched successfully", data });
});
