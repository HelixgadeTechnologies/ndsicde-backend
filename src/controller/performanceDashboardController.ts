import { Request, Response } from "express";
import {
    getPerformanceSummary,
    getKpiActualsVsTargets,
    getProjectStatusDistribution,
    getProgressTracking,
    getProjectPerformanceDetails,
    getPerformanceDashboard,
} from "../service/performanceDashboardService";
import { IDateRangeFilter } from "../interface/performanceDashboardInterface";

// ✅ Get Complete Performance Dashboard
export const getPerformanceDashboardController = async (req: Request, res: Response) => {
    try {
        const filter: IDateRangeFilter = {
            startDate: req.query.startDate as string,
            endDate: req.query.endDate as string,
            projectId: req.query.projectId as string,
            thematicArea: req.query.thematicArea as string,
            resultType: req.query.resultType as string,
        };

        const data = await getPerformanceDashboard(filter);

        res.status(200).json({
            success: true,
            message: "Performance dashboard data retrieved successfully",
            data,
        });
    } catch (error: any) {
        console.error("Error in getPerformanceDashboardController:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve performance dashboard data",
            error: error.message,
        });
    }
};

// ✅ Get Performance Summary
export const getPerformanceSummaryController = async (req: Request, res: Response) => {
    try {
        const filter: IDateRangeFilter = {
            startDate: req.query.startDate as string,
            endDate: req.query.endDate as string,
            projectId: req.query.projectId as string,
        };

        const data = await getPerformanceSummary(filter);

        res.status(200).json({
            success: true,
            message: "Performance summary retrieved successfully",
            data,
        });
    } catch (error: any) {
        console.error("Error in getPerformanceSummaryController:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve performance summary",
            error: error.message,
        });
    }
};

// ✅ Get KPI Actuals vs Targets
export const getKpiActualsVsTargetsController = async (req: Request, res: Response) => {
    try {
        const filter: IDateRangeFilter = {
            startDate: req.query.startDate as string,
            endDate: req.query.endDate as string,
            projectId: req.query.projectId as string,
            thematicArea: req.query.thematicArea as string,
            resultType: req.query.resultType as string,
        };

        const data = await getKpiActualsVsTargets(filter);

        res.status(200).json({
            success: true,
            message: "KPI actuals vs targets retrieved successfully",
            data,
        });
    } catch (error: any) {
        console.error("Error in getKpiActualsVsTargetsController:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve KPI actuals vs targets",
            error: error.message,
        });
    }
};

// ✅ Get Project Status Distribution
export const getProjectStatusDistributionController = async (req: Request, res: Response) => {
    try {
        const filter: IDateRangeFilter = {
            projectId: req.query.projectId as string,
        };

        const data = await getProjectStatusDistribution(filter);

        res.status(200).json({
            success: true,
            message: "Project status distribution retrieved successfully",
            data,
        });
    } catch (error: any) {
        console.error("Error in getProjectStatusDistributionController:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve project status distribution",
            error: error.message,
        });
    }
};

// ✅ Get Progress Tracking
export const getProgressTrackingController = async (req: Request, res: Response) => {
    try {
        const filter: IDateRangeFilter = {
            projectId: req.query.projectId as string,
        };

        const data = await getProgressTracking(filter);

        res.status(200).json({
            success: true,
            message: "Progress tracking data retrieved successfully",
            data,
        });
    } catch (error: any) {
        console.error("Error in getProgressTrackingController:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve progress tracking data",
            error: error.message,
        });
    }
};

// ✅ Get Project Performance Details
export const getProjectPerformanceDetailsController = async (req: Request, res: Response) => {
    try {
        const filter: IDateRangeFilter = {
            projectId: req.query.projectId as string,
        };

        const data = await getProjectPerformanceDetails(filter);

        res.status(200).json({
            success: true,
            message: "Project performance details retrieved successfully",
            data,
        });
    } catch (error: any) {
        console.error("Error in getProjectPerformanceDetailsController:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve project performance details",
            error: error.message,
        });
    }
};
