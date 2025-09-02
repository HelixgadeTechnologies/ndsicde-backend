import { Router } from "express";
import { createOrUpdateRetirementController, getRetirement, getRetirements, removeRetirement } from "../controllers/retirementController";

const retirementRouter: Router = Router();


/**
 * @swagger
 * /api/retirement/retirement:
 *   post:
 *     summary: Create or Update a Retirement
 *     description: |
 *       This endpoint is used for **both creating and updating** a Retirement record.
 *       - When `isCreate` is `true`, a new Retirement is created.
 *       - When `isCreate` is `false`, the existing Retirement will be updated using the `retirementId` inside the payload.
 *     tags: [Retirement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isCreate:
 *                 type: boolean
 *                 example: true
 *               payload:
 *                 $ref: '#/components/schemas/Retirement'
 *     responses:
 *       200:
 *         description: Retirement created or updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
retirementRouter.post("/retirement", createOrUpdateRetirementController);

/**
 * @swagger
 * /api/retirement/retirements:
 *   get:
 *     summary: Get all Retirements
 *     description: Retrieve a list of all Retirement records.
 *     tags: [Retirement]
 *     responses:
 *       200:
 *         description: List of retirements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Retirement'
 *       500:
 *         description: Server error
 */
retirementRouter.get("/retirements", getRetirements);

/**
 * @swagger
 * /api/retirement/retirement/{retirementId}:
 *   get:
 *     summary: Get Retirement by ID
 *     description: Retrieve a single Retirement record by its `retirementId`.
 *     tags: [Retirement]
 *     parameters:
 *       - name: retirementId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Retirement found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Retirement'
 *       404:
 *         description: Retirement not found
 *       500:
 *         description: Server error
 */
retirementRouter.get("/retirement/:retirementId", getRetirement);

/**
 * @swagger
 * /api/retirement/retirement{retirementId}:
 *   delete:
 *     summary: Delete Retirement
 *     description: Delete a Retirement record by its `retirementId`.
 *     tags: [Retirement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: retirementId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Retirement deleted successfully
 *       404:
 *         description: Retirement not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
retirementRouter.delete("/retirement/:retirementId", removeRetirement);

export default retirementRouter;
