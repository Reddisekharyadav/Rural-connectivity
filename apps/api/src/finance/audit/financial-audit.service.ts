import { Injectable, Logger } from '@nestjs/common';

export interface FinancialAuditLog {
  id: string;
  userId?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  oldState?: string | null;
  newState?: string | null;
  ipAddress?: string;
  requestId?: string;
  createdAt: Date;
}

@Injectable()
export class FinancialAuditService {
  private readonly logger = new Logger(FinancialAuditService.name);
  private auditLogs: FinancialAuditLog[] = [];

  async logAction(params: {
    userId?: string;
    action: string;
    resourceType: string;
    resourceId: string;
    oldState?: any;
    newState?: any;
    ipAddress?: string;
    requestId?: string;
  }): Promise<FinancialAuditLog> {
    this.logger.log(
      `[FINANCIAL_AUDIT] action=${params.action} res=${params.resourceType}:${params.resourceId} user=${params.userId || 'SYSTEM'}`
    );
    const entry: FinancialAuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: params.userId,
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      oldState: params.oldState ? JSON.stringify(params.oldState) : null,
      newState: params.newState ? JSON.stringify(params.newState) : null,
      ipAddress: params.ipAddress,
      requestId: params.requestId || `req-${Date.now()}`,
      createdAt: new Date(),
    };
    this.auditLogs.unshift(entry);
    return entry;
  }

  async getAuditLogs(resourceId?: string, limit = 50): Promise<FinancialAuditLog[]> {
    if (resourceId) {
      return this.auditLogs.filter((l) => l.resourceId === resourceId).slice(0, limit);
    }
    return this.auditLogs.slice(0, limit);
  }
}
