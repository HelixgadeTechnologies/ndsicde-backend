import { Router } from "express";
import { createIndicatorReportCommentController, getAllIndicatorReportCommentsController, getAllIndicatorReports, getBudgetUtilization, getCommentsByIndicatorReportIdController, getDashboardSummary, getIndicatorReportOverviewController, getKpiPerformance, getProjects, getProjectStatusDistribution } from "../controllers/managementAndStaffControlleer";

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
 *     summary: Get all projects
 *     description: >
 *       Fetch all projects as an array. Sorting and filtering should be done client-side.
 *     tags:
 *       - MANAGEMENT AND STAFF
 *     responses:
 *       200:
 *         description: Projects fetched successfully
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
 *                   example: Projects fetched successfully
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
 *                         format: date-time
 *                       endDate:
 *                         type: string
 *                         format: date-time
 *                       thematicAreasOrPillar:
 *                         type: string
 *                       strategicObjective:
 *                         type: object
 *                         properties:
 *                           statement:
 *                             type: string
 *                       teamMember:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             fullName:
 *                               type: string
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
 *     summary: Get all indicator reports
 *     description: Returns an array of all indicator reports with calculated KPI status and result type information
 *     tags:
 *       - MANAGEMENT AND STAFF
 *     responses:
 *       200:
 *         description: Successfully retrieved all indicator reports
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
 *                   example: "Indicator reports fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       reportId:
 *                         type: string
 *                         example: "550e8400-e29b-41d4-a716-446655440000"
 *                       reportTitle:
 *                         type: string
 *                         example: "Q1 Marketing Performance"
 *                       project:
 *                         type: string
 *                         example: "Marketing Campaign 2023"
 *                       dateGenerated:
 *                         type: string
 *                         example: "Jan 15, 2023"
 *                       status:
 *                         type: string
 *                         example: "Approved"
 *                       kpiStatus:
 *                         type: string
 *                         enum: [Met, Not Met, N/A]
 *                         example: "Met"
 *                       resultType:
 *                         type: string
 *                         example: "Impact"
 *                       resultTypeId:
 *                         type: string
 *                         example: "ioju8988bhb87t68bniu89"
 *                       indicatorSource:
 *                         type: string
 *                         example: "Quarterly Report"
 *                       responsiblePersons:
 *                         type: string
 *                         example: "John Doe, Jane Smith"
 *                       actualDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-03-31T00:00:00.000Z"
 *                       cumulativeActual:
 *                         type: string
 *                         example: "95"
 *                       actualNarrative:
 *                         type: string
 *                         example: "Marketing campaign exceeded expectations"
 *                       attachmentUrl:
 *                         type: string
 *                         example: "https://example.com/report.pdf"
 *                       createAt:
 *                         type: string
 *                         format: date-time
 *                       updateAt:
 *                         type: string
 *                         format: date-time
 *                       resultTypeDetails:
 *                         type: object
 *                         properties:
 *                           resultName:
 *                             type: string
 *                             example: "Impact"
 *                           resultTypeId:
 *                             type: string
 *                             example: "ioju8988bhb87t68bniu89"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch indicator reports"
 *                 error:
 *                   type: string
 *                   example: "Database connection error"
 */
managementAndStaffRouter.get("/indicator-reports", getAllIndicatorReports);

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

/**
 * @swagger
 * /api/managementAndStaff/indicator-reports-overview/{indicatorReportId}:
 *   get:
 *     summary: Get indicator report overview (financial overview + comments)
 *     tags:
 *       - MANAGEMENT AND STAFF
 *     parameters:
 *       - in: path
 *         name: indicatorReportId
 *         required: true
 *         schema:
 *           type: string
 *         description: Indicator Report ID
 *     responses:
 *       200:
 *         description: Indicator report overview fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Indicator report overview fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     financialOverview:
 *                       type: object
 *                       properties:
 *                         months:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
 *                         budget:
 *                           type: array
 *                           items:
 *                             type: number
 *                           example: [70000, 100000, 40000, 72000, 52000, 90000, 120000, 150000, 180000, 210000, 240000, 270000]
 *                         actualSpending:
 *                           type: array
 *                           items:
 *                             type: number
 *                           example: [60000, 78000, 28000, 92000, 43000, 75000, 105000, 135000, 165000, 195000, 225000, 255000]
 *                     comments:
 *                       type: array
 *                       description: List of comments linked to the indicator report
 *                       items:
 *                         type: object
 *                         properties:
 *                           indicatorReportCommentId:
 *                             type: string
 *                             example: "b1c2d3e4-f567-890a-bcde-f1234567890a"
 *                           indicatorReportId:
 *                             type: string
 *                             example: "a123bc45-de67-890f-gh12-ijk345lmn678"
 *                           comment:
 *                             type: string
 *                             example: "Performance improved significantly this quarter."
 *                           createAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-06-01T10:15:30.000Z"
 *                           updateAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-06-02T14:20:10.000Z"
 *       404:
 *         description: Indicator report not found
 *       500:
 *         description: Server error
 */
managementAndStaffRouter.get(
    "/indicator-reports-overview/:indicatorReportId",
    getIndicatorReportOverviewController
);

export default managementAndStaffRouter;
