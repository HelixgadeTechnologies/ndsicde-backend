import { Router } from "express";
import { createOrUpdateRetirementController, getRetirement, getRetirements, removeRetirement, approveRetirementController } from "../controllers/retirementController";

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

/**
 * @swagger
 * /api/retirement/retirement/approve:
 *   post:
 *     summary: Approve, Reject or Send Retirement for Review
 *     description: |
 *       Processes an approval action on a Retirement record. The service **automatically detects**
 *       the current pending approval level (A → B → C) based on existing approvals.
 *
 *       **Approval Levels (3 levels, sequential):**
 *       - Level A — First approval
 *       - Level B — Second approval (requires Level A = Approved)
 *       - Level C — Final approval (requires Level B = Approved)
 *
 *       **Approval Status Values:**
 *       | Value | Meaning |
 *       |-------|---------|
 *       | `1`   | Approved |
 *       | `2`   | Rejected |
 *       | `3`   | Under Review (resets all other levels) |
 *
 *       **Status Transitions:**
 *       - `1` at Level A → `"Layer 1 Approved"`
 *       - `1` at Level B → `"Layer 2 Approved"`
 *       - `1` at Level C → `"Approved"` (final)
 *       - `2` at any level → `"Rejected"`
 *       - `3` at any level → `"Under Review"` (clears all other levels)
 *     tags: [Retirement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - retirementId
 *               - approvalStatus
 *               - approvedBy
 *             properties:
 *               retirementId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the retirement record to process
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               approvalStatus:
 *                 type: number
 *                 enum: [1, 2, 3]
 *                 description: "1 = Approved, 2 = Rejected, 3 = Under Review"
 *                 example: 1
 *               approvedBy:
 *                 type: string
 *                 description: User ID or display name of the approver
 *                 example: "user-uuid-or-name"
 *               comment:
 *                 type: string
 *                 description: Optional comment or reason for this approval action
 *                 example: "All receipts verified and amounts match."
 *     responses:
 *       200:
 *         description: Retirement approval processed successfully
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
 *                   example: "Retirement approval processed successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Retirement'
 *       400:
 *         description: Validation error or business rule violation (e.g. previous level not yet approved)
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
 *                   example: "Previous level A must be approved first"
 *       401:
 *         description: Unauthorized — bearer token missing or invalid
 *       404:
 *         description: Retirement record not found
 *       500:
 *         description: Internal server error
 */
retirementRouter.post("/retirement/approve", approveRetirementController);

export default retirementRouter;
