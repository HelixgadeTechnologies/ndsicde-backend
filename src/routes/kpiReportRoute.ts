import { Router } from "express";
import {
    getKpiDashboardStatsController,
    getKpiPerformanceChartController,
    getKpiTypeDistributionController,
    getKpiRecentSubmissionsController,
    getAssignedKpiListController,
} from "../controllers/kpiReportController";

const kpiReportRouter: Router = Router();

/**
 * @swagger
 * /api/kpi-report/stats:
 *   get:
 *     summary: KPI Dashboard Stat Cards
 *     description: |
 *       Returns all top stat card data:
 *       - **Total Assigned KPIs** + distinct project count
 *       - **Pending Updates** (pending within last 7 days)
 *       - **Achieved Targets** count + success rate %
 *     tags: [KPI Report]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema: { type: string }
 *         required: false
 *         description: Filter by user ID
 *       - in: query
 *         name: projectId
 *         schema: { type: string }
 *         required: false
 *         description: Filter by project ID
 *     responses:
 *       200:
 *         description: Stats fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalAssignedKpis: { type: number, example: 24 }
 *                     acrossProjects:    { type: number, example: 3 }
 *                     pendingUpdates:    { type: number, example: 5 }
 *                     achievedTargets:   { type: number, example: 6 }
 *                     successRate:       { type: number, example: 75 }
 *       500:
 *         description: Server error
 */
kpiReportRouter.get("/stats", getKpiDashboardStatsController);

/**
 * @swagger
 * /api/kpi-report/performance-chart:
 *   get:
 *     summary: KPI Performance Overview (Line Chart)
 *     description: Monthly average target vs actual values. Defaults to last 6 months if no date range given.
 *     tags: [KPI Report]
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema: { type: string }
 *         required: false
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date-time }
 *         required: false
 *         example: "2026-01-01T00:00:00Z"
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date-time }
 *         required: false
 *         example: "2026-12-31T23:59:59Z"
 *     responses:
 *       200:
 *         description: Chart data fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:  { type: string, example: "Jan 2026" }
 *                       target: { type: number, example: 75 }
 *                       actual: { type: number, example: 62 }
 *       500:
 *         description: Server error
 */
kpiReportRouter.get("/performance-chart", getKpiPerformanceChartController);

/**
 * @swagger
 * /api/kpi-report/type-distribution:
 *   get:
 *     summary: KPI Type Distribution (Pie Chart)
 *     description: Distribution of KPI types (Output / Outcome / Impact) as counts and percentages.
 *     tags: [KPI Report]
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema: { type: string }
 *         required: false
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date-time }
 *         required: false
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date-time }
 *         required: false
 *     responses:
 *       200:
 *         description: Distribution fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:       { type: string, example: "Output" }
 *                       count:      { type: number, example: 53 }
 *                       percentage: { type: number, example: 53.0 }
 *       500:
 *         description: Server error
 */
kpiReportRouter.get("/type-distribution", getKpiTypeDistributionController);

/**
 * @swagger
 * /api/kpi-report/submissions:
 *   get:
 *     summary: Recent Submissions and Status (Table)
 *     description: Filterable list of KPI reports with project, user, strategic objective, and latest review info.
 *     tags: [KPI Report]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         required: false
 *         description: Search by KPI name
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [All, Approved, Pending, Rejected] }
 *         required: false
 *       - in: query
 *         name: projectId
 *         schema: { type: string }
 *         required: false
 *         description: UUID or "All"
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date-time }
 *         required: false
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date-time }
 *         required: false
 *     responses:
 *       200:
 *         description: Submissions fetched
 *       500:
 *         description: Server error
 */
kpiReportRouter.get("/submissions", getKpiRecentSubmissionsController);

/**
 * @swagger
 * /api/kpi-report/assigned:
 *   get:
 *     summary: Assigned KPI List (Table Page)
 *     description: Returns the list of KPI Reports for the "Assigned KPI" table. Columns - KPI Name, Type, Baseline, Target, Date Created, Status.
 *     tags: [KPI Report]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema: { type: string }
 *         required: false
 *         description: Filter by assigned user ID
 *       - in: query
 *         name: projectId
 *         schema: { type: string }
 *         required: false
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [All, Active, Inactive, Approved, Pending, Rejected] }
 *         required: false
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         required: false
 *         description: Search by KPI name
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date-time }
 *         required: false
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date-time }
 *         required: false
 *     responses:
 *       200:
 *         description: List fetched
 *       500:
 *         description: Server error
 */
kpiReportRouter.get("/assigned", getAssignedKpiListController);

export default kpiReportRouter;
