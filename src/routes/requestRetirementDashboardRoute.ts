import { Router } from "express";
import {
    getDashboardStatsController,
    getActivityFinancialListController,
} from "../controllers/requestRetirementDashboardController";

const requestRetirementDashboardRouter: Router = Router();

/**
 * @swagger
 * /api/request-retirement-dashboard/stats:
 *   get:
 *     summary: Get Request & Retirement Dashboard Stats
 *     description: |
 *       Returns all top-of-page widgets for the Request & Retirement Manager dashboard:
 *       - **Pending Requests** count + week-over-week % change
 *       - **Awaiting Approval** count + week-over-week % change
 *       - **Retirement Requests** count + week-over-week % change
 *       - **Request Status Distribution** (Approved / Rejected / Pending counts for bar chart)
 *       - **Total Project Activity Request Approved** (sum of `total` on approved requests)
 *       - **Total Project Activity Amount Retired** (sum of `actualCost` on retirements)
 *       - **Percent Amount Retired** (derived ratio)
 *     tags: [Request & Retirement Dashboard]
 *     responses:
 *       200:
 *         description: Stats fetched successfully
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
 *                   example: "Dashboard stats fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     pendingRequests:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: number
 *                           example: 24
 *                         percentageChange:
 *                           type: number
 *                           example: 5
 *                     awaitingApproval:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: number
 *                           example: 12
 *                         percentageChange:
 *                           type: number
 *                           example: -2
 *                     retirementRequests:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: number
 *                           example: 5
 *                         percentageChange:
 *                           type: number
 *                           example: 8
 *                     statusDistribution:
 *                       type: object
 *                       properties:
 *                         approved:
 *                           type: number
 *                           example: 80
 *                         rejected:
 *                           type: number
 *                           example: 95
 *                         pending:
 *                           type: number
 *                           example: 65
 *                     totalApprovedAmount:
 *                       type: number
 *                       example: 10000000
 *                     totalRetiredAmount:
 *                       type: number
 *                       example: 10000000
 *                     percentAmountRetired:
 *                       type: number
 *                       example: 10
 *       500:
 *         description: Server error
 */
requestRetirementDashboardRouter.get("/stats", getDashboardStatsController);

/**
 * @swagger
 * /api/request-retirement-dashboard/list:
 *   get:
 *     summary: Get Activity Financial List (Requests or Retirements)
 *     description: |
 *       Powers both tabs in the bottom table of the dashboard.
 *       - `type=request` → returns Activity Financial Requests with project info
 *       - `type=retirement` → returns Activity Financial Retirements with linked request and project info
 *
 *       Supports filtering by `status`, `projectId`, `search` text, and date range.
 *     tags: [Request & Retirement Dashboard]
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [request, retirement]
 *         description: Which tab to load data for
 *         example: request
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Text search on activity title, description, or staff name
 *         example: transport
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Approved, Pending, Rejected]
 *         description: Filter by request/retirement status
 *         example: Approved
 *       - in: query
 *         name: projectId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by project UUID, or "All" for no filter
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date filter (ISO 8601)
 *         example: "2026-02-01T00:00:00Z"
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date filter (ISO 8601)
 *         example: "2026-02-28T23:59:59Z"
 *     responses:
 *       200:
 *         description: List fetched successfully
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
 *                   example: "Activity financial list fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Missing or invalid `type` query parameter
 *       500:
 *         description: Server error
 */
requestRetirementDashboardRouter.get("/list", getActivityFinancialListController);

export default requestRetirementDashboardRouter;
