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

/**
 * @swagger
 * /api/request/request/approve:
 *   post:
 *     summary: Approve or Reject a Request
 *     description: Process approval for a request. The service automatically detects which approval level (A-E) should be processed based on existing approvals. Approvals must happen sequentially.
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
 *                 description: Request ID to approve/reject
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               approvalStatus:
 *                 type: number
 *                 enum: [1, 2]
 *                 description: 1 = Approved, 2 = Rejected
 *                 example: 1
 *               approvedBy:
 *                 type: string
 *                 description: User ID or name of the approver
 *                 example: "user-123"
 *               comment:
 *                 type: string
 *                 description: Optional comment for the approval/rejection
 *                 example: "Approved for budget allocation"
 *     responses:
 *       200:
 *         description: Approval processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       400:
 *         description: Invalid request or validation error
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
