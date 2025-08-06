import { Router } from "express";
import { createOrUpdateKpi, createOrUpdateStrategicObjective, fetchAllKpis, fetchAllStrategicObjectives, fetchKpiById, fetchStrategicObjectiveById, removeKpi, removeStrategicObjective } from "../controllers/strategicObjectiveAndKpiController";
const strategicObjectiveRouter: Router = Router();

/**
 * @swagger
 * /api/strategic-objectivesAndKpi/strategic-objective:
 *   post:
 *     summary: Create or update a strategic objective
 *     tags: [Strategic Objectives And Kpi]
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     description: If `isCreate` is true, a new user is created.
 *       - If `isCreate` is false, the existing StrategicObjectives is updated (requires `strategicObjectiveId` inside `data`).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isCreate
 *               - data
 *             properties:
 *               isCreate:
 *                 type: boolean
 *               data:
 *                 type: object
 *                 required:
 *                   - statement
 *                 properties:
 *                   strategicObjectiveId:
 *                     type: string
 *                     description: Required for update
 *                   statement:
 *                     type: string
 *                   thematicAreas:
 *                     type: string
 *                   pillarLead:
 *                     type: string
 *                   status:
 *                     type: string
 *     responses:
 *       201:
 *         description: Created
 *       200:
 *         description: Updated
 *       400:
 *         description: Error or invalid input
 */
strategicObjectiveRouter.post("/strategic-objective", createOrUpdateStrategicObjective);

/**
 * @swagger
 * /api/strategic-objectivesAndKpi/delete:
 *   delete:
 *     summary: Delete a strategic objective
 *     tags: [Strategic Objectives And Kpi]
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - strategicObjectiveId
 *             properties:
 *               strategicObjectiveId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Deleted
 *       400:
 *         description: Error or not found
 */
strategicObjectiveRouter.delete("/delete", removeStrategicObjective);


/**
 * @swagger
 * /api/strategic-objectivesAndKpi/strategic-objectives:
 *   get:
 *     summary: Get all strategic objectives
 *     tags: [Strategic Objectives And Kpi]
 *     responses:
 *       200:
 *         description: A list of strategic objectives
 *       500:
 *         description: Server error
 */
strategicObjectiveRouter.get("/strategic-objectives", fetchAllStrategicObjectives);

/**
 * @swagger
 * /api/strategic-objectivesAndKpi/strategic-objectives/{id}:
 *   get:
 *     summary: Get a specific strategic objective by ID
 *     tags: [Strategic Objectives And Kpi]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the strategic objective
 *     responses:
 *       200:
 *         description: Strategic objective found
 *       404:
 *         description: Strategic objective not found
 *       500:
 *         description: Server error
 */
strategicObjectiveRouter.get("/strategic-objectives/:id", fetchStrategicObjectiveById);

/**
 * @swagger
 * /api/strategic-objectivesAndKpi/kpi:
 *   post:
 *     summary: Create or update a KPI
 *     tags: [Strategic Objectives And Kpi]
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isCreate
 *               - data
 *             properties:
 *               isCreate:
 *                 type: boolean
 *               data:
 *                 type: object
 *                 properties:
 *                   kpiId:
 *                     type: string
 *                     description: Required for update
 *                   statement:
 *                     type: string
 *                   definition:
 *                     type: string
 *                   type:
 *                     type: string
 *                   specificAreas:
 *                     type: string
 *                   unitOfMeasure:
 *                     type: string
 *                   itemInMeasure:
 *                     type: string
 *                   disaggregation:
 *                     type: string
 *                   baseLine:
 *                     type: string
 *                   target:
 *                     type: string
 *                   strategicObjectiveId:
 *                     type: string
 *     responses:
 *       201:
 *         description: Created
 *       200:
 *         description: Updated
 *       400:
 *         description: Validation or server error
 */
strategicObjectiveRouter.post("/kpi", createOrUpdateKpi);

/**
 * @swagger
 * /api/strategic-objectivesAndKpi/deleteKpi:
 *   delete:
 *     summary: Delete a KPI by ID
 *     tags: [Strategic Objectives And Kpi]
 *     security:
 *       - bearerAuth: []  # 👈 This enables JWT token authentication in Swagger
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - kpiId
 *             properties:
 *               kpiId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Deleted
 *       400:
 *         description: Error
 */
strategicObjectiveRouter.delete("/deleteKpi", removeKpi);


/**
 * @swagger
 * /api/strategic-objectivesAndKpi/kpis:
 *   get:
 *     summary: Get all KPIs
 *     tags: [Strategic Objectives And Kpi]
 *     responses:
 *       200:
 *         description: List of KPIs
 *       500:
 *         description: Server error
 */
strategicObjectiveRouter.get("/kpis", fetchAllKpis);

/**
 * @swagger
 * /api/strategic-objectivesAndKpi/kpi/{id}:
 *   get:
 *     summary: Get a KPI by ID
 *     tags: [Strategic Objectives And Kpi]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: KPI ID
 *     responses:
 *       200:
 *         description: KPI found
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
strategicObjectiveRouter.get("/kpi/:id", fetchKpiById);


export default strategicObjectiveRouter;
