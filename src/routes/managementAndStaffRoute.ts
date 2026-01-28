import { Router } from "express";
import { createIndicatorReportCommentController, getAllIndicatorReportCommentsController, getBudgetUtilization, getCommentsByIndicatorReportIdController, getDashboardSummary, getIndicatorReportsController, getKpiPerformance, getProjects, getProjectStatusDistribution } from "../controllers/managementAndStaffControlleer";

const managementAndStaffRouter = Router();

/**
 * @swagger
 * /api/managementAndStaff/summary:
 *   get:
 *     summary: Get dashboard summary statistics
 *     description: >
 *       Returns overall dashboard statistics including total projects,
 *       active projects, completed projects, on-hold projects, and active KPIs.
 *     tags:
 *       - MANAGEMENT AND STAFF
 *     responses:
 *       200:
 *         description: Dashboard summary fetched successfully
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
 *                   example: Dashboard summary fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalProjects:
 *                       type: number
 *                       example: 24
 *                     activeProjects:
 *                       type: number
 *                       example: 14
 *                     completedProjects:
 *                       type: number
 *                       example: 5
 *                     onHoldProjects:
 *                       type: number
 *                       example: 5
 *                     activeKpis:
 *                       type: number
 *                       example: 5
 *       404:
 *         description: Dashboard summary not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 success: false
 *                 message: Dashboard summary not found
 *                 data: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 success: false
 *                 message: Internal server error
 */

managementAndStaffRouter.get("/summary", getDashboardSummary);

/**
 * @swagger
 * /api/managementAndStaff/kpi-performance:
 *   get:
 *     summary: Get KPI performance (Target vs Actual)
 *     tags:
 *       - MANAGEMENT AND STAFF
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: number
 *           example: 2023
 *     responses:
 *       200:
 *         description: KPI performance fetched successfully
 *       404:
 *         description: KPI performance data not found
 *       500:
 *         description: Internal server error
 */
managementAndStaffRouter.get("/kpi-performance", getKpiPerformance);

/**
 * @swagger
 * /api/managementAndStaff/projects:
 *   get:
 *     summary: Get list of projects
 *     description: >
 *       Fetch projects with search, filters, date range, and pagination.
 *     tags:
 *       - MANAGEMENT AND STAFF
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: health
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         example: Active
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         example: Healthcare
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           example: 10
 *     responses:
 *       200:
 *         description: Projects fetched successfully
 *       404:
 *         description: Projects not found
 *       500:
 *         description: Internal server error
 */

managementAndStaffRouter.get("/projects", getProjects);

/**
 * @swagger
 * /api/managementAndStaff/project-status-distribution:
 *   get:
 *     summary: Get project status distribution
 *     description: Returns percentage distribution of projects by status
 *     tags:
 *       - MANAGEMENT AND STAFF
 *     responses:
 *       200:
 *         description: Project status distribution fetched successfully
 *       404:
 *         description: Project status distribution data not found
 *       500:
 *         description: Internal server error
 */
managementAndStaffRouter.get("/project-status-distribution", getProjectStatusDistribution);

/**
 * @swagger
 * /api/managementAndStaff/budget-utilization:
 *   get:
 *     summary: Get budget utilization
 *     description: Returns percentage distribution of projects by status
 *     tags:
 *       - MANAGEMENT AND STAFF
 *     responses:
 *       200:
 *         description: Budget utilization fetched successfully
 *       404:
 *         description: Budget utilization data not found
 *       500:
 *         description: Internal server error
 */
managementAndStaffRouter.get("/budget-utilization", getBudgetUtilization);


/**
 * @swagger
 * /api/managementAndStaff/indicator-reports:
 *   get:
 *     summary: Get indicator reports with filters
 *     description: Fetch reports for View Reports & Comments table
 *     tags:
 *       - MANAGEMENT AND STAFF
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by report title
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           example: Approved
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           example: 10
 *     responses:
 *       200:
 *         description: Reports fetched successfully
 *       404:
 *         description: No reports found
 *       500:
 *         description: Server error
 */
managementAndStaffRouter.get("/indicator-reports", getIndicatorReportsController);


/**
 * @swagger
 * /api/managementAndStaff/indicator-reports:
 *   get:
 *     summary: Retrieve a list of indicator reports
 *     description: Returns paginated indicator reports filtered by search, status, impact, outcome, or output.
 *     tags:
 *       - MANAGEMENT AND STAFF
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for indicator statement
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Status of the indicator report
 *       - in: query
 *         name: impact
 *         schema:
 *           type: string
 *         description: Filter by impact (ResultType ID)
 *       - in: query
 *         name: outcome
 *         schema:
 *           type: string
 *         description: Filter by outcome (ResultType ID)
 *       - in: query
 *         name: output
 *         schema:
 *           type: string
 *         description: Filter by output (ResultType ID)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Reports fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           indicatorReportId:
 *                             type: string
 *                           indicatorStatement:
 *                             type: string
 *                           thematicAreasOrPillar:
 *                             type: string
 *                           status:
 *                             type: string
 *                           createAt:
 *                             type: string
 *                             format: date-time
 *                           cumulativeActual:
 *                             type: number
 *                           indicator:
 *                             type: object
 *                             properties:
 *                               cumulativeTarget:
 *                                 type: number
 *                           kpiStatus:
 *                             type: string
 *                             description: KPI status, either 'Met' or 'Not Met'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       404:
 *         description: No reports found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
managementAndStaffRouter.get("/indicator-reports", getIndicatorReportsController);

/**
 * @swagger
 * /api/managementAndStaff/indicator-report-comments:
 *   post:
 *     summary: Create a comment for an indicator report
 *     tags:
 *       - MANAGEMENT AND STAFF
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - indicatorReportId
 *               - comment
 *             properties:
 *               indicatorReportId:
 *                 type: string
 *                 description: ID of the indicator report
 *               comment:
 *                 type: string
 *                 description: Comment text
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     indicatorReportCommentId:
 *                       type: string
 *                     indicatorReportId:
 *                       type: string
 *                     comment:
 *                       type: string
 *                     createAt:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Internal server error
 */
managementAndStaffRouter.post("/indicator-report-comments", createIndicatorReportCommentController);

/**
 * @swagger
 * /api/managementAndStaff/indicator-report-comments/{indicatorReportId}:
 *   get:
 *     summary: Get all comments for an indicator report
 *     tags:
 *       - MANAGEMENT AND STAFF
 *     parameters:
 *       - in: path
 *         name: indicatorReportId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the indicator report
 *     responses:
 *       200:
 *         description: List of comments fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       indicatorReportCommentId:
 *                         type: string
 *                       indicatorReportId:
 *                         type: string
 *                       comment:
 *                         type: string
 *                       createAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: No comments found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
managementAndStaffRouter.get("/indicator-report-comments/:indicatorReportId", getCommentsByIndicatorReportIdController);

/**
 * @swagger
 * /api/managementAndStaff/all-indicator-report-comments:
 *   get:
 *     summary: Get all indicator report comments
 *     description: Retrieve a list of all indicator report comments, sorted by creation date descending.
 *     tags:
 *       - MANAGEMENT AND STAFF
 *     responses:
 *       200:
 *         description: Comments fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       indicatorReportCommentId:
 *                         type: string
 *                       indicatorReportId:
 *                         type: string
 *                       comment:
 *                         type: string
 *                       createAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: No comments found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
managementAndStaffRouter.get("/all-indicator-report-comments", getAllIndicatorReportCommentsController);

export default managementAndStaffRouter;
