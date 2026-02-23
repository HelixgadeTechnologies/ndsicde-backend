import { Request, Response } from "express";
import {
    getRequestRetirementDashboardStats,
    getActivityFinancialList,
    ActivityListFilters,
} from "../service/requestRetirementDashboardService";

// ─────────────────────────────────────────────────────────────
// GET /api/request-retirement-dashboard/stats
// ─────────────────────────────────────────────────────────────
export const getDashboardStatsController = async (
    req: Request,
    res: Response
) => {
    try {
        const data = await getRequestRetirementDashboardStats();
        res.status(200).json({
            success: true,
            message: "Dashboard stats fetched successfully",
            data,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred",
            error: "An error occurred",
        });
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/request-retirement-dashboard/list
// ─────────────────────────────────────────────────────────────
export const getActivityFinancialListController = async (
    req: Request,
    res: Response
) => {
    try {
        const { type, search, status, projectId, startDate, endDate } = req.query;

        if (!type || (type !== "request" && type !== "retirement")) {
            res.status(400).json({
                success: false,
                message: "Query param `type` must be either 'request' or 'retirement'",
            });
            return;
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

        res.status(200).json({
            success: true,
            message: "Activity financial list fetched successfully",
            data,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred",
            error: "An error occurred",
        });
    }
};
