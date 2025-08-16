// services/auditLog.service.ts
import { PrismaClient } from '@prisma/client';
import { IAuditLogView } from '../interface/auditLogInterface';

const prisma = new PrismaClient();

export class AuditLogService {
  // Create a new audit log entry
  async createAuditLog(action: string, userId?: string, details?: string) {
    return prisma.auditLog.create({
      data: {
        action,
        userId: userId || null,
        details: details || null,
      },
    });
  }

  // Get all audit logs 
  async getAllAuditLogs() {
     return prisma.$queryRaw<IAuditLogView[]>`
      SELECT * FROM auditlog_view
      ORDER BY createAt DESC
    `;
  }

  // Get single audit log by ID
  async getAuditLogById(auditLogId: string) {
     return prisma.$queryRaw<IAuditLogView[]>`
      SELECT * FROM auditlog_view WHERE auditLogId = ${auditLogId}
      ORDER BY createAt DESC
    `;
  }

  // Delete an audit log
  async deleteAuditLog(auditLogId: string) {
    return prisma.auditLog.delete({
      where: { auditLogId },
    });
  }
}

// You can create a singleton instance
export const auditLogService = new AuditLogService();
