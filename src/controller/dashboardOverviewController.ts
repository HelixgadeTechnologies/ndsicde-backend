import { Request, Response } from 'express';
import {
    getDashboardStats,
    getRecentActivities,
    getPendingActivityFundRequests,
    getPendingReportApprovals
} from '../service/dashboardOverviewService';

/**
 * Get dashboard overview statistics
 */
export async function getDashboardStatsController(req: Request, res: Response) {
    try {
        const stats = await getDashboardStats();

        res.status(200).json({
            success: true,
            message: 'Dashboard statistics retrieved successfully',
            data: stats
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve dashboard statistics',
            error: error.message
        });
    }
}

/**
 * Get recent activities feed
 */
export async function getRecentActivitiesController(req: Request, res: Response) {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
        const projectId = req.query.projectId as string | undefined;
        const days = req.query.days ? parseInt(req.query.days as string) : undefined;

        const activities = await getRecentActivities({ limit, projectId, days });

        res.status(200).json({
            success: true,
            message: 'Recent activities retrieved successfully',
            data: activities
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve recent activities',
            error: error.message
        });
    }
}

/**
 * Get pending activity fund requests
 */
export async function getPendingFundRequestsController(req: Request, res: Response) {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;

        const requests = await getPendingActivityFundRequests(limit);

        res.status(200).json({
            success: true,
            message: 'Pending fund requests retrieved successfully',
            data: requests
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve pending fund requests',
            error: error.message
        });
    }
}

/**
 * Get pending report approvals
 */
export async function getPendingReportApprovalsController(req: Request, res: Response) {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;

        const approvals = await getPendingReportApprovals(limit);

        res.status(200).json({
            success: true,
            message: 'Pending report approvals retrieved successfully',
            data: approvals
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve pending report approvals',
            error: error.message
        });
    }
}

/**
 * Get complete dashboard overview (all data in one call)
 */
export async function getDashboardOverviewController(req: Request, res: Response) {
    try {
        const projectId = req.query.projectId as string | undefined;

        const [stats, recentActivities, pendingRequests, pendingApprovals] = await Promise.all([
            getDashboardStats(),
            getRecentActivities({ limit: 10, projectId }),
            getPendingActivityFundRequests(5),
            getPendingReportApprovals(5)
        ]);

        res.status(200).json({
            success: true,
            message: 'Dashboard overview retrieved successfully',
            data: {
                stats,
                recentActivities,
                pendingFundRequests: pendingRequests,
                pendingReportApprovals: pendingApprovals
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve dashboard overview',
            error: error.message
        });
    }
}
