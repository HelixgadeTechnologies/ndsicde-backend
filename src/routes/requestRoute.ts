import { Router } from "express";
import { createOrUpdateRequestController, deleteRequestController, getAllRequestsController, getRequestByIdController } from "../controllers/requestController";

const requestRouter: Router = Router();


/**
 * @swagger
 * /api/request/request:
 *   post:
 *     summary: Create or Update a Request
 *     description: Use `isCreate = true` to create a new Request, and `isCreate = false` to update an existing one.
 *     tags: [Request]
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
 *                 $ref: '#/components/schemas/Request'
 *     responses:
 *       200:
 *         description: Request created/updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       500:
 *         description: Server error
 */
requestRouter.post("/request", createOrUpdateRequestController);

/**
 * @swagger
 * /api/request/requests:
 *   get:
 *     summary: Get all Requests
 *     tags: [Request]
 *     responses:
 *       200:
 *         description: List of Requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Request'
 *       404:
 *         description: No Requests found
 *       500:
 *         description: Server error
 */
requestRouter.get("/requests", getAllRequestsController);

/**
 * @swagger
 * /api/request/request/{id}:
 *   get:
 *     summary: Get Request by ID
 *     tags: [Request]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Request details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       404:
 *         description: Request not found
 *       500:
 *         description: Server error
 */
requestRouter.get("/request/:id", getRequestByIdController);

/**
 * @swagger
 * /api/request/request/{id}:
 *   delete:
 *     summary: Delete Request by ID
 *     tags: [Request]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Request deleted successfully
 *       404:
 *         description: Request not found
 *       500:
 *         description: Server error
 */
requestRouter.delete("/request/:id", deleteRequestController);

export default requestRouter;
