import { Router } from "express";
import {
    createOrUpdateRequestController,
    deleteRequestController,
    getAllRequestsController,
    getRequestByIdController,
    requestApprovalController,
    getDataValidationStatsController,
    getRequestsWithDateFilterController,
    getRequestsByProjectIdController
} from "../controllers/requestController";

const requestRouter: Router = Router();


/**
 * @swagger
 * /api/request/request:
 *   post:
 *     summary: Create or Update a Request (with Line Items)
 *     description: |
 *       Use `isCreate = true` to create a new Request, and `isCreate = false` to update an existing one.
 *
 *       **Line Items behaviour:**
 *       - Pass an array of line items under `payload.lineItems`.
 *       - On **create**: all line items are saved to the `lineitem` table linked to the new request.
 *       - On **update**: existing line items for the request are **deleted and replaced** with the new array sent.
 *       - If `lineItems` is empty or omitted, no line items are stored.
 *       - `status` defaults to `"Pending"` on create if not provided.
 *     tags: [Request]
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
 *                 description: true = create new request, false = update existing
 *                 example: true
 *               payload:
 *                 type: object
 *                 properties:
 *                   requestId:
 *                     type: string
 *                     format: uuid
 *                     description: Required only when isCreate = false
 *                     example: "550e8400-e29b-41d4-a716-446655440000"
 *                   staff:
 *                     type: string
 *                     example: "John Doe"
 *                   outputId:
 *                     type: string
 *                     format: uuid
 *                   activityTitle:
 *                     type: string
 *                     example: "Community Training Workshop"
 *                   activityBudgetCode:
 *                     type: number
 *                     example: 1001
 *                   activityLocation:
 *                     type: string
 *                     example: "Port Harcourt"
 *                   activityPurposeDescription:
 *                     type: string
 *                     example: "Training of community members on livelihood skills"
 *                   activityStartDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-05-01T08:00:00Z"
 *                   activityEndDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-05-03T17:00:00Z"
 *                   budgetCode:
 *                     type: number
 *                     example: 2001
 *                   modeOfTransport:
 *                     type: string
 *                     example: "Bus"
 *                   driverName:
 *                     type: string
 *                     example: "Emeka Obi"
 *                   driversPhoneNumber:
 *                     type: string
 *                     example: "08012345678"
 *                   vehiclePlateNumber:
 *                     type: string
 *                     example: "RSH-312-AB"
 *                   vehicleColor:
 *                     type: string
 *                     example: "White"
 *                   departureTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-05-01T07:00:00Z"
 *                   route:
 *                     type: string
 *                     example: "Port Harcourt → Aba → Umuahia"
 *                   recipientPhoneNumber:
 *                     type: string
 *                     example: "08098765432"
 *                   documentName:
 *                     type: string
 *                     example: "Budget_Breakdown.pdf"
 *                   documentURL:
 *                     type: string
 *                     example: "https://storage.example.com/docs/Budget_Breakdown.pdf"
 *                   projectId:
 *                     type: string
 *                     format: uuid
 *                   createdBy:
 *                     type: string
 *                     format: uuid
 *                     description: User ID of the staff creating the request
 *                   status:
 *                     type: string
 *                     example: "Pending"
 *                     description: Defaults to "Pending" on create if omitted
 *                   lineItems:
 *                     type: array
 *                     description: Budget line items to be saved in the lineitem table
 *                     items:
 *                       type: object
 *                       properties:
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
 *     responses:
 *       200:
 *         description: Request created/updated successfully with line items
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
 *                   example: "Request created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     requestId:
 *                       type: string
 *                       format: uuid
 *                     lineItems:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/LineItem'
 *       400:
 *         description: Validation error (e.g. missing requestId on update)
 *       401:
 *         description: Unauthorized
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

/**
 * @swagger
 * /api/request/request/approve:
 *   post:
 *     summary: Approve, Reject or Send Request for Review
 *     description: |
 *       Processes an approval action on a Request record. The service **automatically detects**
 *       the current pending approval level (A → B → C → D) based on existing approvals.
 *
 *       **Approval Levels (4 levels, sequential):**
 *       - Level A — First approval
 *       - Level B — Second approval (requires Level A = Approved)
 *       - Level C — Third approval (requires Level B = Approved)
 *       - Level D — Final approval (requires Level C = Approved)
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
 *       - `1` at Level C → `"Layer 3 Approved"`
 *       - `1` at Level D → `"Approved"` (final)
 *       - `2` at any level → `"Rejected"`
 *       - `3` at any level → `"Under Review"` (clears all other levels)
 *     tags: [Request]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - requestId
 *               - approvalStatus
 *               - approvedBy
 *             properties:
 *               requestId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the request record to process
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
 *                 example: "Approved for budget allocation"
 *     responses:
 *       200:
 *         description: Approval processed successfully
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
 *                   example: "Request approval processed successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Request'
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
 *         description: Request not found
 *       500:
 *         description: Server error
 */
requestRouter.post("/request/approve", requestApprovalController);

/**
 * @swagger
 * /api/request/data-validation/stats:
 *   get:
 *     summary: Get Data Validation Dashboard Statistics
 *     description: Returns statistics for the Data Validation dashboard including total submissions, pending/approved/rejected counts, and approval rates. Supports optional date range filtering.
 *     tags: [Request]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: Start date for filtering (ISO 8601 format)
 *         example: "2024-01-01T00:00:00Z"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: End date for filtering (ISO 8601 format)
 *         example: "2024-12-31T23:59:59Z"
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         required: false
 *         description: Optional project ID to filter statistics
 *         example: "uuid-of-project"
 *     responses:
 *       200:
 *         description: Statistics fetched successfully
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
 *                   example: "Statistics fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalSubmissions:
 *                       type: number
 *                       example: 150
 *                     pendingReview:
 *                       type: number
 *                       example: 25
 *                     approved:
 *                       type: number
 *                       example: 100
 *                     rejected:
 *                       type: number
 *                       example: 25
 *                     pendingFinancialRequests:
 *                       type: number
 *                       example: 25
 *                     approvedRetirements:
 *                       type: number
 *                       example: 80
 *                     totalRetirement:
 *                       type: number
 *                       example: 90
 *                     percentageFromLastMonth:
 *                       type: number
 *                       example: 15.5
 *                     approvalRate:
 *                       type: number
 *                       example: 66.67
 *                     rejectionRate:
 *                       type: number
 *                       example: 16.67
 *       500:
 *         description: Server error
 */
requestRouter.get("/data-validation/stats", getDataValidationStatsController);

/**
 * @swagger
 * /api/request/data-validation/list:
 *   post:
 *     summary: Get Filtered Requests List
 *     description: Returns a list of requests filtered by date range. Includes project information and ordered by creation date (newest first).
 *     tags: [Request]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Start date for filtering (ISO 8601 format)
 *                 example: "2024-01-01T00:00:00Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: End date for filtering (ISO 8601 format)
 *                 example: "2024-12-31T23:59:59Z"
 *     responses:
 *       200:
 *         description: Requests fetched successfully
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
 *                   example: "Requests fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Request'
 *       404:
 *         description: No requests found
 *       500:
 *         description: Server error
 */
requestRouter.post("/data-validation/list", getRequestsWithDateFilterController);

/**
 * @swagger
 * /api/request/getRequestByProjectId/{projectId}:
 *   get:
 *     summary: Get Requests by Project ID
 *     description: Returns a list of requests for a specific project, including associated project and retirement data.
 *     tags: [Request]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Requests fetched successfully
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
 *                   example: "Requests fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Request'
 *       400:
 *         description: Project ID is required
 *       404:
 *         description: No requests found for this project
 *       500:
 *         description: Server error
 */
requestRouter.get("/project/:projectId", getRequestsByProjectIdController);

export default requestRouter;
