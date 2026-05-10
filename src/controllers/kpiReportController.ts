import { Request, Response } from "express";
import {
    getKpiDashboardStats,
    getKpiPerformanceChart,
    getKpiTypeDistribution,
    getKpiRecentSubmissions,
    getAssignedKpiList,
} from "../service/kpiReportService";

// ─────────────────────────────────────────────────────────────
// GET /api/kpi-report/stats
// ─────────────────────────────────────────────────────────────
export const getKpiDashboardStatsController = async (
    req: Request,
    res: Response
) => {
    try {
        const { userId, projectId } = req.query;
        const data = await getKpiDashboardStats(
            userId as string | undefined,
            projectId as string | undefined
        );
        res.status(200).json({ success: true, message: "Stats fetched", data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message, error: "An error occurred" });
    }
};

// ────────────────// ─────────────────────────────────────────────
// GET /api/kpi-report/assigned
// ─────────────────────────────────────────────
export const getAssignedKpiListController = async (
    req: Request,
    res: Response
) => {
    try {
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
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message, error: "An error occurred" });
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/kpi-report/performance-chart
// ─────────────────────────────────────────────────────────────
export const getKpiPerformanceChartController = async (
    req: Request,
    res: Response
) => {
    try {
        const { projectId, startDate, endDate } = req.query;
        const data = await getKpiPerformanceChart({
            projectId: projectId as string | undefined,
            startDate: startDate as string | undefined,
            endDate: endDate as string | undefined,
        });
        res.status(200).json({ success: true, message: "Performance chart data fetched", data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message, error: "An error occurred" });
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/kpi-report/type-distribution
// ─────────────────────────────────────────────────────────────
export const getKpiTypeDistributionController = async (
    req: Request,
    res: Response
) => {
    try {
        const { projectId, startDate, endDate } = req.query;
        const data = await getKpiTypeDistribution({
            projectId: projectId as string | undefined,
            startDate: startDate as string | undefined,
            endDate: endDate as string | undefined,
        });
        res.status(200).json({ success: true, message: "Type distribution fetched", data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message, error: "An error occurred" });
    }
};

// ─────────────────────────────────────────────────────────────
// GET /api/kpi-report/submissions
// ─────────────────────────────────────────────────────────────
export const getKpiRecentSubmissionsController = async (
    req: Request,
    res: Response
) => {
    try {
        const { search, status, projectId, startDate, endDate } = req.query;
        const data = await getKpiRecentSubmissions({
            search: search as string | undefined,
            status: status as string | undefined,
            projectId: projectId as string | undefined,
            startDate: startDate as string | undefined,
            endDate: endDate as string | undefined,
        });
        res.status(200).json({ success: true, message: "Submissions fetched", data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message, error: "An error occurred" });
    }
};