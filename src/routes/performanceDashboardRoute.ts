import express from "express";
import {
    getPerformanceDashboardController,
    getPerformanceSummaryController,
    getKpiActualsVsTargetsController,
    getProjectStatusDistributionController,
    getProgressTrackingController,
    getProjectPerformanceDetailsController,
} from "../controller/performanceDashboardController";

const router = express.Router();

/**
 * @swagger
 * /api/performance-dashboard:
 *   get:
 *     summary: Get complete performance dashboard data
 *     description: Retrieves all performance metrics including summary, KPI tracking, status distribution, and progress tracking
 *     tags: [Performance Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (ISO format)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (ISO format)
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Filter by specific project ID
 *       - in: query
 *         name: thematicArea
 *         schema:
 *           type: string
 *         description: Filter by thematic area
 *       - in: query
 *         name: resultType
 *         schema:
 *           type: string
 *           enum: [Impact, Outcome, Output]
 *         description: Filter by result type
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: object
 *                     kpiActualsVsTargets:
 *                       type: array
 *                     statusDistribution:
 *                       type: array
 *                     progressTracking:
 *                       type: object
 *                     projectDetails:
 *                       type: array
 *       500:
 *         description: Server error
 */
router.get("/", getPerformanceDashboardController);

/**
 * @swagger
 * /api/performance-dashboard/summary:
 *   get:
 *     summary: Get performance summary metrics
 *     description: Retrieves high-level performance metrics including total projects, completed KPIs, pending requests, budget utilization, and health score
 *     tags: [Performance Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (ISO format)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (ISO format)
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Filter by specific project ID
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalActiveProjects:
 *                       type: number
 *                       example: 24
 *                     completedKPIsPercentage:
 *                       type: number
 *                       example: 78
 *                     pendingRequests:
 *                       type: number
 *                       example: 12
 *                     budgetUtilization:
 *                       type: number
 *                       example: 92
 *                     projectHealthScore:
 *                       type: number
 *                       example: 86
 *                     percentageFromLastPeriod:
 *                       type: number
 *                       example: 12.5
 *       500:
 *         description: Server error
 */
router.get("/summary", getPerformanceSummaryController);

/**
 * @swagger
 * /api/performance-dashboard/kpi-actuals-vs-targets:
 *   get:
 *     summary: Get KPI actuals vs targets
 *     description: Retrieves quarterly comparison of KPI actual values vs target values
 *     tags: [Performance Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (ISO format)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (ISO format)
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Filter by specific project ID
 *       - in: query
 *         name: thematicArea
 *         schema:
 *           type: string
 *         description: Filter by thematic area
 *       - in: query
 *         name: resultType
 *         schema:
 *           type: string
 *           enum: [Impact, Outcome, Output]
 *         description: Filter by result type
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       period:
 *                         type: string
 *                         example: "Quarter 1"
 *                       year:
 *                         type: number
 *                         example: 2026
 *                       actual:
 *                         type: number
 *                         example: 110
 *                       target:
 *                         type: number
 *                         example: 200
 *                       achievementPercentage:
 *                         type: number
 *                         example: 55
 *       500:
 *         description: Server error
 */
router.get("/kpi-actuals-vs-targets", getKpiActualsVsTargetsController);

/**
 * @swagger
 * /api/performance-dashboard/status-distribution:
 *   get:
 *     summary: Get project status distribution
 *     description: Retrieves distribution of projects by status (On Track, Delays, At Risk)
 *     tags: [Performance Dashboard]
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Filter by specific project ID
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                         enum: ["On Track", "Delays", "At Risk"]
 *                         example: "On Track"
 *                       count:
 *                         type: number
 *                         example: 8
 *                       percentage:
 *                         type: number
 *                         example: 33.33
 *       500:
 *         description: Server error
 */
router.get("/status-distribution", getProjectStatusDistributionController);

/**
 * @swagger
 * /api/performance-dashboard/progress-tracking:
 *   get:
 *     summary: Get progress tracking metrics
 *     description: Retrieves progress metrics for Activity, Output, Outcome, and Impact levels
 *     tags: [Performance Dashboard]
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Filter by specific project ID
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     activity:
 *                       type: object
 *                       properties:
 *                         percentage:
 *                           type: number
 *                           example: 92
 *                         status:
 *                           type: string
 *                           example: "On Track"
 *                     output:
 *                       type: object
 *                       properties:
 *                         percentage:
 *                           type: number
 *                           example: 42
 *                         status:
 *                           type: string
 *                           example: "In Progress"
 *                     outcomes:
 *                       type: object
 *                       properties:
 *                         percentage:
 *                           type: number
 *                           example: 14
 *                         status:
 *                           type: string
 *                           example: "At Risk"
 *                     impact:
 *                       type: object
 *                       properties:
 *                         percentage:
 *                           type: number
 *                           example: 75
 *                         status:
 *                           type: string
 *                           example: "On Track"
 *       500:
 *         description: Server error
 */
router.get("/progress-tracking", getProgressTrackingController);

/**
 * @swagger
 * /api/performance-dashboard/project-details:
 *   get:
 *     summary: Get detailed project performance data
 *     description: Retrieves detailed performance metrics for each project including budget, indicators, activities, and risk level
 *     tags: [Performance Dashboard]
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Filter by specific project ID
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       projectId:
 *                         type: string
 *                       projectName:
 *                         type: string
 *                       status:
 *                         type: string
 *                       startDate:
 *                         type: string
 *                         format: date
 *                       endDate:
 *                         type: string
 *                         format: date
 *                       totalBudget:
 *                         type: number
 *                       budgetUtilization:
 *                         type: number
 *                       healthScore:
 *                         type: number
 *                       indicators:
 *                         type: object
 *                         properties:
 *                           total:
 *                             type: number
 *                           achieved:
 *                             type: number
 *                           pending:
 *                             type: number
 *                           achievementRate:
 *                             type: number
 *                       activities:
 *                         type: object
 *                         properties:
 *                           total:
 *                             type: number
 *                           completed:
 *                             type: number
 *                           completionRate:
 *                             type: number
 *                       riskLevel:
 *                         type: string
 *                         enum: ["Low", "Medium", "High"]
 *       500:
 *         description: Server error
 */
router.get("/project-details", getProjectPerformanceDetailsController);

export default router;
