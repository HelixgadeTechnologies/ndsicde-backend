export interface IAuditLog {
  auditLogId: string;
  action: string;
  userId?: string | null;
  details?: string | null;
  createAt: Date;
  updateAt: Date;
}

export interface IAuditLogView {
  auditLogId: string;
  action: string;
  details?: string | null;
  userId?: string | null;
  userName?: string | null;
  createAt: Date;
  updateAt: Date;
}