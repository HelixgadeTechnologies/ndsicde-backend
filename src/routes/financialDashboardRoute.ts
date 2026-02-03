import express from "express";
import {
    getFinancialDashboardController,
    getFinancialSummaryController,
    getBudgetTrendsController,
    getExpenseBreakdownController,
    getProjectFinancialPerformanceController,
    getBudgetVsActualsController,
    getDetailedExpensesController,
} from "../controller/financialDashboardController";

const router = express.Router();

/**
 * @swagger
 * /api/financial-dashboard:
 *   get:
 *     summary: Get complete financial dashboard data
 *     description: Retrieves comprehensive financial reporting data including budget summary, trends, expense breakdown, project performance, and detailed transactions
 *     tags: [Financial Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *         example: "2024-01-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *         example: "2024-12-31"
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Filter by specific project ID
 *     responses:
 *       200:
 *         description: Financial dashboard data retrieved successfully
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
 *                       properties:
 *                         totalBudgetAllocated:
 *                           type: number
 *                         totalExpensesIncurred:
 *                           type: number
 *                         budgetVariance:
 *                           type: number
 *                         budgetVariancePercentage:
 *                           type: number
 *                         percentageFromLastPeriod:
 *                           type: number
 *                     budgetTrends:
 *                       type: array
 *                       items:
 *                         type: object
 *                     expenseBreakdown:
 *                       type: array
 *                       items:
 *                         type: object
 *                     projectPerformance:
 *                       type: array
 *                       items:
 *                         type: object
 *                     budgetVsActuals:
 *                       type: array
 *                       items:
 *                         type: object
 *                     detailedExpenses:
 *                       type: array
 *                       items:
 *                         type: object
 *       500:
 *         description: Server error
 */
router.get("/", getFinancialDashboardController);

/**
 * @swagger
 * /api/financial-dashboard/summary:
 *   get:
 *     summary: Get financial summary metrics
 *     description: Retrieves high-level budget summary including total allocated, expenses incurred, and variance
 *     tags: [Financial Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Filter by specific project ID
 *     responses:
 *       200:
 *         description: Financial summary retrieved successfully
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
 *                     totalBudgetAllocated:
 *                       type: number
 *                       example: 1250000
 *                     totalExpensesIncurred:
 *                       type: number
 *                       example: 875000
 *                     budgetVariance:
 *                       type: number
 *                       example: 375000
 *                     budgetVariancePercentage:
 *                       type: number
 *                       example: -7.5
 *                     percentageFromLastPeriod:
 *                       type: number
 *                       example: 12.5
 *       500:
 *         description: Server error
 */
router.get("/summary", getFinancialSummaryController);

/**
 * @swagger
 * /api/financial-dashboard/budget-trends:
 *   get:
 *     summary: Get budget vs. expenditure trends
 *     description: Retrieves monthly comparison of budget allocation vs actual spending
 *     tags: [Financial Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Filter by specific project ID
 *     responses:
 *       200:
 *         description: Budget trends retrieved successfully
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
 *                       month:
 *                         type: string
 *                         example: "Jan"
 *                       year:
 *                         type: number
 *                         example: 2024
 *                       budget:
 *                         type: number
 *                         example: 100000
 *                       expenditure:
 *                         type: number
 *                         example: 85000
 *       500:
 *         description: Server error
 */
router.get("/budget-trends", getBudgetTrendsController);

/**
 * @swagger
 * /api/financial-dashboard/expense-breakdown:
 *   get:
 *     summary: Get expense breakdown by category
 *     description: Retrieves expenses grouped by category (Personnel, Equipment, Services, Travel, Other)
 *     tags: [Financial Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Filter by specific project ID
 *     responses:
 *       200:
 *         description: Expense breakdown retrieved successfully
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
 *                       category:
 *                         type: string
 *                         example: "Personnel"
 *                       amount:
 *                         type: number
 *                         example: 250000
 *                       percentage:
 *                         type: number
 *                         example: 33
 *       500:
 *         description: Server error
 */
router.get("/expense-breakdown", getExpenseBreakdownController);

/**
 * @swagger
 * /api/financial-dashboard/project-performance:
 *   get:
 *     summary: Get project financial performance
 *     description: Retrieves financial performance metrics for each project
 *     tags: [Financial Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Filter by specific project ID
 *     responses:
 *       200:
 *         description: Project financial performance retrieved successfully
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
 *                       approvedBudget:
 *                         type: number
 *                       actualExpenses:
 *                         type: number
 *                       variance:
 *                         type: number
 *                       variancePercentage:
 *                         type: number
 *                       status:
 *                         type: string
 *                         enum: ["Under Budget", "On Budget", "Over Budget", "No Spending"]
 *       500:
 *         description: Server error
 */
router.get("/project-performance", getProjectFinancialPerformanceController);

/**
 * @swagger
 * /api/financial-dashboard/budget-vs-actuals:
 *   get:
 *     summary: Get budget vs. actuals comparison
 *     description: Retrieves comparison of approved expenses vs actual expenses for each project
 *     tags: [Financial Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Filter by specific project ID
 *     responses:
 *       200:
 *         description: Budget vs. actuals retrieved successfully
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
 *                       approvedExpenses:
 *                         type: number
 *                       actualExpenses:
 *                         type: number
 *                       varianceAmount:
 *                         type: number
 *                       variancePercentage:
 *                         type: number
 *                       status:
 *                         type: string
 *                         enum: ["Under Budget", "Over Budget", "On Track"]
 *       500:
 *         description: Server error
 */
router.get("/budget-vs-actuals", getBudgetVsActualsController);

/**
 * @swagger
 * /api/financial-dashboard/detailed-expenses:
 *   get:
 *     summary: Get detailed expense transactions
 *     description: Retrieves transaction-level expense data with project, category, and receipt information
 *     tags: [Financial Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Filter by specific project ID
 *     responses:
 *       200:
 *         description: Detailed expenses retrieved successfully
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
 *                       transactionId:
 *                         type: string
 *                       projectId:
 *                         type: string
 *                       projectName:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       category:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       description:
 *                         type: string
 *                       receipt:
 *                         type: string
 *                       type:
 *                         type: string
 *                         enum: ["Request", "Retirement"]
 *       500:
 *         description: Server error
 */
router.get("/detailed-expenses", getDetailedExpensesController);

export default router;
