// controllers/auditLog.controller.ts
import { Request, Response } from 'express';
import { AuditLogService } from '../service/auditlogService';
import { errorResponse, successResponse } from '../utils/responseHandler';

export class AuditLogController {
  private auditLogService: AuditLogService;

  constructor() {
    this.auditLogService = new AuditLogService();
  }

  // GET /audit-logs
  public getAllAuditLogs = async (req: Request, res: Response) => {
    try {
      const logs = await this.auditLogService.getAllAuditLogs();
      return res.status(200).json(successResponse("Audit logs", logs));
       
    } catch (error) {
        res.status(500).json(errorResponse("Internal server error", error));
    }
  };
}
