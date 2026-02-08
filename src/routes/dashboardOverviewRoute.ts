import express from 'express';
import {
    getDashboardStatsController,
    getRecentActivitiesController,
    getPendingFundRequestsController,
    getPendingReportApprovalsController,
    getDashboardOverviewController
} from '../controller/dashboardOverviewController';

const dashboardOverviewRouter = express.Router();

/**
 * @swagger
 * /api/dashboard-overview/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Retrieves all dashboard statistics including total projects, team members, KPIs, financial requests, upcoming deadlines, and pending reviews
 *     tags: [Dashboard Overview]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Dashboard statistics retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalProjects:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: number
 *                         trend:
 *                           type: string
 *                     teamMembers:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: number
 *                         trend:
 *                           type: string
 *                     activeKpis:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: number
 *                         trend:
 *                           type: string
 *                     financialRequests:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: number
 *                         trend:
 *                           type: string
 *                     upcomingDeadlines:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: number
 *                         trend:
 *                           type: string
 *                     pendingReviews:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: number
 *                         trend:
 *                           type: string
 *       500:
 *         description: Server error
 */
dashboardOverviewRouter.get('/stats', getDashboardStatsController);

/**
 * @swagger
 * /api/dashboard-overview/recent-activities:
 *   get:
 *     summary: Get recent activities
 *     description: Retrieves a unified feed of recent activities from multiple sources (Project, Activity, ActivityReport, Request, TeamMember, IndicatorReport)
 *     tags: [Dashboard Overview]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of activities to return
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Filter by specific project
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *         description: Get activities from last N days
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Recent activities retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       activityId:
 *                         type: string
 *                       activityType:
 *                         type: string
 *                         enum: [project, activity, activity_report, strategic_objective, kpi, team_member, request, indicator_report]
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       actor:
 *                         type: string
 *                       projectName:
 *                         type: string
 *                       projectId:
 *                         type: string
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                       timeAgo:
 *                         type: string
 *       500:
 *         description: Server error
 */
dashboardOverviewRouter.get('/recent-activities', getRecentActivitiesController);

/**
 * @swagger
 * /api/dashboard-overview/pending-fund-requests:
 *   get:
 *     summary: Get pending activity fund requests
 *     description: Retrieves pending activity fund requests for the dashboard widget
 *     tags: [Dashboard Overview]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of requests to return
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Pending fund requests retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       requestId:
 *                         type: string
 *                       title:
 *                         type: string
 *                       projectName:
 *                         type: string
 *                       status:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       timeAgo:
 *                         type: string
 *       500:
 *         description: Server error
 */
dashboardOverviewRouter.get('/pending-fund-requests', getPendingFundRequestsController);

/**
 * @swagger
 * /api/dashboard-overview/pending-report-approvals:
 *   get:
 *     summary: Get pending report approvals
 *     description: Retrieves pending indicator report approvals for the dashboard widget
 *     tags: [Dashboard Overview]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of approvals to return
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Pending report approvals retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       reportId:
 *                         type: string
 *                       title:
 *                         type: string
 *                       type:
 *                         type: string
 *                       status:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       timeAgo:
 *                         type: string
 *       500:
 *         description: Server error
 */
dashboardOverviewRouter.get('/pending-report-approvals', getPendingReportApprovalsController);

/**
 * @swagger
 * /api/dashboard-overview:
 *   get:
 *     summary: Get complete dashboard overview
 *     description: Retrieves all dashboard data in a single call (stats, recent activities, pending requests, and pending approvals). Returns aggregated data for all projects by default, or filtered by a specific project if projectId is provided.
 *     tags: [Dashboard Overview]
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Optional - Filter activities by specific project. If not provided, shows data for all projects.
 *         example: "abc-123-xyz"
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Dashboard overview retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                       description: Dashboard statistics (6 metric cards)
 *                     recentActivities:
 *                       type: array
 *                       description: 10 most recent activities
 *                     pendingFundRequests:
 *                       type: array
 *                       description: 5 pending fund requests
 *                     pendingReportApprovals:
 *                       type: array
 *                       description: 5 pending report approvals
 *       500:
 *         description: Server error
 */
dashboardOverviewRouter.get('/', getDashboardOverviewController);

export default dashboardOverviewRouter;
