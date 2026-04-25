import { Router } from "express";
import { createOrUpdateRetirementController, getRetirement, getRetirements, removeRetirement, approveRetirementController, getRetirementByProject } from "../controllers/retirementController";

const retirementRouter: Router = Router();


/**
 * @swagger
 * /api/retirement/retirement:
 *   post:
 *     summary: Create or Update a Retirement (with Line Items)
 *     description: |
 *       This endpoint is used for **both creating and updating** a Retirement record.
 *       - When `isCreate` is `true`, a new Retirement is created.
 *       - When `isCreate` is `false`, the existing Retirement will be updated using the `retirementId` inside the payload.
 *
 *       **Line Items behaviour:**
 *       - Pass an array of line items under `payload.lineItems` (these are rows in the `lineitem` table linked to the associated `requestId`).
 *       - Each item with a `lineItemId` will have its `totalSpent` and `variance` **updated** on the existing row.
 *       - Each item **without** a `lineItemId` will be **created** as a new line item linked to the request.
 *       - If `lineItems` is empty or omitted, no line item changes are made.
 *       - `requestId` is required in the payload when `lineItems` are provided.
 *       - `status` defaults to `"Pending"` on create if not provided.
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
 *               - isCreate
 *               - payload
 *             properties:
 *               isCreate:
 *                 type: boolean
 *                 description: true = create new retirement, false = update existing
 *                 example: true
 *               payload:
 *                 type: object
 *                 properties:
 *                   retirementId:
 *                     type: string
 *                     format: uuid
 *                     description: Required only when isCreate = false
 *                     example: "550e8400-e29b-41d4-a716-446655440000"
 *                   requestId:
 *                     type: string
 *                     format: uuid
 *                     description: The associated request. Required when lineItems are provided.
 *                     example: "7a3f881c-12bc-4d4f-a901-1234567890ab"
 *                   activityLineDescription:
 *                     type: string
 *                     example: "Fuel purchase for field trip"
 *                   quantity:
 *                     type: number
 *                     example: 1
 *                   frequency:
 *                     type: number
 *                     example: 1
 *                   unitCost:
 *                     type: number
 *                     example: 15000
 *                   actualCost:
 *                     type: number
 *                     example: 14500
 *                   totalBudget:
 *                     type: number
 *                     example: 15000
 *                   documentName:
 *                     type: string
 *                     example: "Receipt_FuelPurchase.pdf"
 *                   documentURL:
 *                     type: string
 *                     example: "https://storage.example.com/docs/Receipt_FuelPurchase.pdf"
 *                   status:
 *                     type: string
 *                     example: "Pending"
 *                     description: Defaults to "Pending" on create if omitted
 *                   lineItems:
 *                     type: array
 *                     description: |
 *                       Line items linked to the associated request.
 *                       - Provide `lineItemId` to update an existing row (only `totalSpent` and `variance` are updated).
 *                       - Omit `lineItemId` to create a new line item row.
 *                     items:
 *                       type: object
 *                       properties:
 *                         lineItemId:
 *                           type: string
 *                           format: uuid
 *                           description: ID of an existing line item to update. Omit to create a new one.
 *                           example: "abc12345-0000-0000-0000-000000000001"
 *                         activityId:
 *                           type: string
 *                           format: uuid
 *                           description: ID of the activity this line item is for. Omit to create a new one.
 *                           example: "abc12345-0000-0000-0000-000000000002"
 *                         description:
 *                           type: string
 *                           example: "Venue hire"
 *                         quantity:
 *                           type: number
 *                           example: 1
 *                         frequency:
 *                           type: number
 *                           example: 2
 *                         unitCost:
 *                           type: number
 *                           example: 50000
 *                         totalBudget:
 *                           type: number
 *                           example: 100000
 *                         totalSpent:
 *                           type: number
 *                           example: 95000
 *                           description: Actual amount spent against this line item
 *                         variance:
 *                           type: number
 *                           example: 5000
 *                           description: Difference between budget and actual spend (totalBudget - totalSpent)
 *     responses:
 *       200:
 *         description: Retirement created or updated successfully with line items
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
 *                   example: "Retirement created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     retirementId:
 *                       type: string
 *                       format: uuid
 *                     requestId:
 *                       type: string
 *                       format: uuid
 *                     status:
 *                       type: string
 *                       example: "Pending"
 *                     lineItems:
 *                       type: array
 *                       description: All line items linked to the associated request after the operation
 *                       items:
 *                         type: object
 *                         properties:
 *                           lineItemId:
 *                             type: string
 *                             format: uuid
 *                           activityId:
 *                             type: string
 *                             format: uuid
 *                           description:
 *                             type: string
 *                           totalBudget:
 *                             type: number
 *                           totalSpent:
 *                             type: number
 *                           variance:
 *                             type: number
 *       400:
 *         description: Validation error (e.g. missing retirementId on update, missing requestId when lineItems provided)
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
 *     summary: Get all Retirements (with Line Items)
 *     description: Retrieve a list of all Retirement records. Each record includes a `lineItems` array of all line items linked to the retirement's associated request.
 *     tags: [Retirement]
 *     responses:
 *       200:
 *         description: List of retirements, each enriched with their line items
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
 *                   example: "Retirements fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       retirementId:
 *                         type: string
 *                         format: uuid
 *                       requestId:
 *                         type: string
 *                         format: uuid
 *                       activityLineDescription:
 *                         type: string
 *                       quantity:
 *                         type: number
 *                       frequency:
 *                         type: number
 *                       unitCost:
 *                         type: number
 *                       actualCost:
 *                         type: number
 *                       totalBudget:
 *                         type: number
 *                       documentName:
 *                         type: string
 *                       documentURL:
 *                         type: string
 *                       status:
 *                         type: string
 *                         example: "Pending"
 *                       activityTitle:
 *                         type: string
 *                       projectName:
 *                         type: string
 *                       projectId:
 *                         type: string
 *                         format: uuid
 *                       approval_A:
 *                         type: number
 *                       approval_B:
 *                         type: number
 *                       approval_C:
 *                         type: number
 *                       approvedBy_A:
 *                         type: string
 *                       approvedBy_B:
 *                         type: string
 *                       approvedBy_C:
 *                         type: string
 *                       comment_A:
 *                         type: string
 *                       comment_B:
 *                         type: string
 *                       comment_C:
 *                         type: string
 *                       createAt:
 *                         type: string
 *                         format: date-time
 *                       updateAt:
 *                         type: string
 *                         format: date-time
 *                       lineItems:
 *                         type: array
 *                         description: All line items linked to this retirement's associated request
 *                         items:
 *                           type: object
 *                           properties:
 *                             lineItemId:
 *                               type: string
 *                               format: uuid
 *                             activityId:
 *                               type: string
 *                               format: uuid
 *                             description:
 *                               type: string
 *                             quantity:
 *                               type: number
 *                             frequency:
 *                               type: number
 *                             unitCost:
 *                               type: number
 *                             totalBudget:
 *                               type: number
 *                             totalSpent:
 *                               type: number
 *                             variance:
 *                               type: number
 *       500:
 *         description: Server error
 */
retirementRouter.get("/retirements", getRetirements);

/**
 * @swagger
 * /api/retirement/retirement/{retirementId}:
 *   get:
 *     summary: Get Retirement by ID (with Line Items)
 *     description: Retrieve a single Retirement record by its `retirementId`, enriched with all line items linked to its associated request.
 *     tags: [Retirement]
 *     parameters:
 *       - name: retirementId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The UUID of the retirement record to retrieve
 *     responses:
 *       200:
 *         description: Retirement found, enriched with line items
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
 *                   example: "Retirement fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     retirementId:
 *                       type: string
 *                       format: uuid
 *                     requestId:
 *                       type: string
 *                       format: uuid
 *                     activityLineDescription:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     frequency:
 *                       type: number
 *                     unitCost:
 *                       type: number
 *                     actualCost:
 *                       type: number
 *                     totalBudget:
 *                       type: number
 *                     documentName:
 *                       type: string
 *                     documentURL:
 *                       type: string
 *                     status:
 *                       type: string
 *                       example: "Pending"
 *                     activityTitle:
 *                       type: string
 *                     projectName:
 *                       type: string
 *                     approval_A:
 *                       type: number
 *                     approval_B:
 *                       type: number
 *                     approval_C:
 *                       type: number
 *                     approvedBy_A:
 *                       type: string
 *                     approvedBy_B:
 *                       type: string
 *                     approvedBy_C:
 *                       type: string
 *                     comment_A:
 *                       type: string
 *                     comment_B:
 *                       type: string
 *                     comment_C:
 *                       type: string
 *                     createAt:
 *                       type: string
 *                       format: date-time
 *                     updateAt:
 *                       type: string
 *                       format: date-time
 *                     lineItems:
 *                       type: array
 *                       description: All line items linked to this retirement's associated request
 *                       items:
 *                         type: object
 *                         properties:
 *                           lineItemId:
 *                             type: string
 *                             format: uuid
 *                           activityId:
 *                             type: string
 *                             format: uuid
 *                           description:
 *                             type: string
 *                           quantity:
 *                             type: number
 *                           frequency:
 *                             type: number
 *                           unitCost:
 *                             type: number
 *                           totalBudget:
 *                             type: number
 *                           totalSpent:
 *                             type: number
 *                           variance:
 *                             type: number
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

/**
 * @swagger
 * /api/retirement/retirement/project/{projectId}:
 *   get:
 *     summary: Get Retirements by Project ID (with Line Items)
 *     description: Retrieve all Retirement records linked to a specific `projectId`, enriched with line items.
 *     tags: [Retirement]
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The UUID of the project
 *     responses:
 *       200:
 *         description: List of retirements found for the project
 *       404:
 *         description: No retirements found for this project
 *       500:
 *         description: Server error
 */
retirementRouter.get("/retirement/project/:projectId", getRetirementByProject);

export default retirementRouter;

