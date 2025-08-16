// routes/auditLog.routes.ts
import { Router } from "express";
import { AuditLogController } from "../controllers/auditlogController";

const auditLogRouter: Router = Router();
const auditLogController = new AuditLogController();

/**
 * @swagger
 * /api/auditLog/audit-logs:
 *   get:
 *     summary: Get all audit logs
 *     description: Retrieve a list of audit log records from the audit log view.
 *     tags: [AuditLog]
 *     responses:
 *       200:
 *         description: List of audit logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       auditLogId:
 *                         type: string
 *                         example: "d54a8c52-3c6d-4dc8-b6a2-28b76c7656dd"
 *                       action:
 *                         type: string
 *                         example: "User Created"
 *                       userId:
 *                         type: string
 *                         example: "a1234-5678-90ab-cdef"
 *                       userFullName:
 *                         type: string
 *                         example: "John Doe"
 *                       details:
 *                         type: string
 *                         example: "Created a new project"
 *                       createAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-08-14T14:20:00Z"
 *       500:
 *         description: Server error
 */
auditLogRouter.get("/audit-logs", auditLogController.getAllAuditLogs.bind(auditLogController));

export default auditLogRouter;
