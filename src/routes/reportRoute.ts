import express from 'express';
import {
    generateReportController,
    getAllReportsController,
    getReportByIdController,
    downloadReportController,
    deleteReportController
} from '../controller/reportController';

const reportRouter = express.Router();

/**
 * @swagger
 * /api/reports/generate:
 *   post:
 *     summary: Generate a new report
 *     description: Generates a comprehensive PDF report with visualizations based on Activity, Request, and Retirement data
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reportType
 *             properties:
 *               reportType:
 *                 type: string
 *                 enum: [Activity Summary, Financial Overview, Request Analysis, Retirement Analysis]
 *                 description: Type of report to generate
 *                 example: "Activity Summary"
 *               reportName:
 *                 type: string
 *                 description: Custom name for the report (optional, auto-generated if not provided)
 *                 example: "Q1 2026 Activity Report"
 *               projectId:
 *                 type: string
 *                 description: Filter by specific project ID (optional, includes all projects if not provided)
 *                 example: "abc-123-xyz"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Start date for filtering (optional, includes all dates if not provided)
 *                 example: "2026-01-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: End date for filtering (optional, includes all dates if not provided)
 *                 example: "2026-02-08"
 *               selectedMetrics:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum:
 *                     - budgetUtilization
 *                     - completionRate
 *                     - approvalRate
 *                     - timelineAdherence
 *                     - costVariance
 *                     - activityProgress
 *                     - requestTurnaroundTime
 *                     - retirementCompletionRate
 *                 description: |
 *                   Specific metrics to include in the report (optional, includes all metrics if not provided).
 *                   Available metrics:
 *                   - budgetUtilization: Percentage of budget used vs allocated
 *                   - completionRate: Percentage of activities/tasks completed
 *                   - approvalRate: Percentage of requests approved
 *                   - timelineAdherence: How well projects are staying on schedule
 *                   - costVariance: Difference between budgeted and actual costs
 *                   - activityProgress: Overall progress of activities
 *                   - requestTurnaroundTime: Average time to process requests
 *                   - retirementCompletionRate: Percentage of retirements completed
 *                 example: ["budgetUtilization", "completionRate"]
 *               generatedBy:
 *                 type: string
 *                 description: User ID who is generating the report
 *                 example: "user-123"
 *     responses:
 *       201:
 *         description: Report generated successfully
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
 *                   example: "Report generated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     reportId:
 *                       type: string
 *                       example: "report-uuid-123"
 *                     reportName:
 *                       type: string
 *                       example: "Q1 2026 Activity Report"
 *                     fileUrl:
 *                       type: string
 *                       example: "/reports/report_1234567890.pdf"
 *                     fileSize:
 *                       type: number
 *                       example: 524288
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalActivities:
 *                           type: number
 *                         completedActivities:
 *                           type: number
 *                         totalRequests:
 *                           type: number
 *                         budgetUtilization:
 *                           type: number
 *       400:
 *         description: Bad request - missing or invalid parameters
 *       500:
 *         description: Server error
 */
reportRouter.post('/generate', generateReportController);

/**
 * @swagger
 * /api/reports/all:
 *   get:
 *     summary: Get all reports
 *     description: Retrieves a list of all generated reports with optional filtering
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Filter by project ID
 *         example: "abc-123-xyz"
 *       - in: query
 *         name: reportType
 *         schema:
 *           type: string
 *           enum: [Activity Summary, Financial Overview, Request Analysis, Retirement Analysis]
 *         description: Filter by report type
 *         example: "Activity Summary"
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
 *                   example: "Reports retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       reportId:
 *                         type: string
 *                       reportName:
 *                         type: string
 *                       reportType:
 *                         type: string
 *                       projectId:
 *                         type: string
 *                       startDate:
 *                         type: string
 *                         format: date-time
 *                       endDate:
 *                         type: string
 *                         format: date-time
 *                       generatedBy:
 *                         type: string
 *                       fileUrl:
 *                         type: string
 *                       fileSize:
 *                         type: number
 *                       status:
 *                         type: string
 *                       totalActivities:
 *                         type: number
 *                       totalRequests:
 *                         type: number
 *                       totalRetirements:
 *                         type: number
 *                       budgetUtilization:
 *                         type: number
 *                       createAt:
 *                         type: string
 *                         format: date-time
 *                       project:
 *                         type: object
 *                         properties:
 *                           projectName:
 *                             type: string
 *       500:
 *         description: Server error
 */
reportRouter.get('/all', getAllReportsController);

/**
 * @swagger
 * /api/reports/getReportById/{reportId}:
 *   get:
 *     summary: Get report by ID
 *     description: Retrieves detailed information about a specific report
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *         description: Report ID
 *         example: "report-uuid-123"
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
 *                   example: "Report retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     reportId:
 *                       type: string
 *                     reportName:
 *                       type: string
 *                     reportType:
 *                       type: string
 *                     projectId:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *                     selectedMetrics:
 *                       type: string
 *                     generatedBy:
 *                       type: string
 *                     fileUrl:
 *                       type: string
 *                     fileSize:
 *                       type: number
 *                     status:
 *                       type: string
 *                     totalActivities:
 *                       type: number
 *                     totalRequests:
 *                       type: number
 *                     totalRetirements:
 *                       type: number
 *                     budgetUtilization:
 *                       type: number
 *                     createAt:
 *                       type: string
 *                       format: date-time
 *                     updateAt:
 *                       type: string
 *                       format: date-time
 *                     project:
 *                       type: object
 *                       properties:
 *                         projectName:
 *                           type: string
 *       404:
 *         description: Report not found
 *       500:
 *         description: Server error
 */
reportRouter.get('/getReportById/:reportId', getReportByIdController);

/**
 * @swagger
 * /api/reports/downloadReportById/{reportId}:
 *   get:
 *     summary: Download report PDF
 *     description: Downloads the generated PDF report file
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *         description: Report ID
 *         example: "report-uuid-123"
 *     responses:
 *       200:
 *         description: PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Report or file not found
 *       500:
 *         description: Server error
 */
reportRouter.get('/downloadReportById/:reportId', downloadReportController);

/**
 * @swagger
 * /api/reports/deleteReportById/{reportId}:
 *   delete:
 *     summary: Delete report
 *     description: Deletes a report and its associated PDF file
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *         description: Report ID
 *         example: "report-uuid-123"
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
 *                   example: "Report deleted successfully"
 *       404:
 *         description: Report not found
 *       500:
 *         description: Server error
 */
reportRouter.delete('/deleteReportById/:reportId', deleteReportController);

export default reportRouter;
