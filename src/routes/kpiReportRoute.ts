import { Router } from "express";
import {
    getKpiDashboardStatsController,
    getKpiPerformanceChartController,
    getKpiTypeDistributionController,
    getKpiRecentSubmissionsController,
    getAssignedKpiListController,
    getKpiReportByIdController,
    createOrUpdateKpiReportController,
    deleteKpiReportController,
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

/**
 * @swagger
 * /api/kpi-report/report/{id}:
 *   get:
 *     summary: Get Single KPI Report by ID
 *     description: Fetches full details of a single KPI Report (for edit/view form). Returns all fields including reviews.
 *     tags: [KPI Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: KPI Report ID
 *     responses:
 *       200:
 *         description: KPI Report found
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
kpiReportRouter.get("/report/:id", getKpiReportByIdController);

/**
 * @swagger
 * /api/kpi-report/report:
 *   post:
 *     summary: Create or Update a KPI Report
 *     description: |
 *       Dual-purpose endpoint controlled by `isCreate`:
 *       - **`isCreate: true`** — Creates a new KPI Report. All payload fields are optional except any required by your business logic.
 *       - **`isCreate: false`** — Updates an existing KPI Report. `kpiReportId` is **required** inside `payload`.
 *
 *       ### Field Reference
 *       | Field | Type | Required | Description |
 *       |---|---|---|---|
 *       | `strategicObjectiveId` | string (UUID) | Optional | Links report to a strategic objective |
 *       | `projectId` | string (UUID) | Optional | Links report to a project |
 *       | `userId` | string (UUID) | Optional | ID of the user submitting the report |
 *       | `kpiName` | string | Optional | Name/title of the KPI |
 *       | `kpiType` | string | Optional | `Output`, `Outcome`, or `Impact` |
 *       | `baseline` | integer | Optional | Baseline value for comparison |
 *       | `target` | integer | Optional | Target value to be achieved |
 *       | `actualValue` | integer | Optional | Actual achieved value |
 *       | `status` | string | Optional | `Pending`, `Approved`, or `Rejected` |
 *       | `observation` | string | Optional | Narrative/observations text |
 *       | `evidence` | string | Optional | URL or reference to supporting file |
 *     tags: [KPI Report]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isCreate
 *               - payload
 *             properties:
 *               isCreate:
 *                 type: boolean
 *                 description: "`true` to create, `false` to update"
 *                 example: true
 *               payload:
 *                 type: object
 *                 properties:
 *                   kpiReportId:
 *                     type: string
 *                     format: uuid
 *                     description: "Required when `isCreate` is `false`"
 *                     example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *                   strategicObjectiveId:
 *                     type: string
 *                     format: uuid
 *                     example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *                   projectId:
 *                     type: string
 *                     format: uuid
 *                     example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *                   userId:
 *                     type: string
 *                     format: uuid
 *                     example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *                   kpiName:
 *                     type: string
 *                     example: "Percentage of households with clean water"
 *                   kpiType:
 *                     type: string
 *                     enum: [Output, Outcome, Impact]
 *                     example: "Outcome"
 *                   baseline:
 *                     type: integer
 *                     example: 45
 *                   target:
 *                     type: integer
 *                     example: 75
 *                   actualValue:
 *                     type: integer
 *                     nullable: true
 *                     description: "Optional — the actual value achieved"
 *                     example: 60
 *                   status:
 *                     type: string
 *                     enum: [Pending, Approved, Rejected]
 *                     example: "Pending"
 *                   observation:
 *                     type: string
 *                     description: "Narrative/observations about this KPI"
 *                     example: "Progress has been steady across all three regions."
 *                   evidence:
 *                     type: string
 *                     description: "URL or file reference for supporting evidence"
 *                     example: "https://files.example.com/evidence.pdf"
 *           examples:
 *             Create:
 *               summary: Create a new KPI Report
 *               value:
 *                 isCreate: true
 *                 payload:
 *                   strategicObjectiveId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *                   projectId: "4ab96g75-6828-5673-c4gd-3d074g77bgb7"
 *                   userId: "5bc07h86-7939-6784-d5he-4e185h88chc8"
 *                   kpiName: "Percentage of households with clean water"
 *                   kpiType: "Outcome"
 *                   baseline: 45
 *                   target: 75
 *                   actualValue: 60
 *                   status: "Pending"
 *                   observation: "Progress steady across all regions."
 *                   evidence: "https://files.example.com/report.pdf"
 *             Update:
 *               summary: Update an existing KPI Report
 *               value:
 *                 isCreate: false
 *                 payload:
 *                   kpiReportId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *                   actualValue: 70
 *                   status: "Approved"
 *                   observation: "Target nearly reached."
 *     responses:
 *       201:
 *         description: KPI Report created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "KPI Report created" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     kpiReportId: { type: string }
 *                     kpiName: { type: string }
 *                     kpiType: { type: string }
 *                     baseline: { type: integer }
 *                     target: { type: integer }
 *                     actualValue: { type: integer, nullable: true }
 *                     status: { type: string }
 *                     createdAt: { type: string, format: date-time }
 *       200:
 *         description: KPI Report updated successfully
 *       400:
 *         description: "`isCreate` field is missing or not a boolean"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: "isCreate (boolean) is required" }
 *       500:
 *         description: Server error
 */
kpiReportRouter.post("/report", createOrUpdateKpiReportController);

/**
 * @swagger
 * /api/kpi-report/report/{id}:
 *   delete:
 *     summary: Delete a KPI Report
 *     description: Deletes the KPI report and all associated KpiReview records.
 *     tags: [KPI Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: KPI Report ID
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       500:
 *         description: Server error
 */
kpiReportRouter.delete("/report/:id", deleteKpiReportController);

export default kpiReportRouter;
