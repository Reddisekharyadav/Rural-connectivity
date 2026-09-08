import { Injectable, Logger } from '@nestjs/common';

export interface ApiRequestLog {
  id: string;
  requestId: string;
  userId?: string;
  organizationId?: string;
  apiClientId?: string;
  endpoint: string;
  httpMethod: string;
  statusCode: number;
  latencyMs: number;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

@Injectable()
export class PlatformAuditService {
  private readonly logger = new Logger(PlatformAuditService.name);
  private auditLogsStore: ApiRequestLog[] = [];

  async logApiRequest(data: {
    requestId: string;
    endpoint: string;
    httpMethod: string;
    statusCode: number;
    latencyMs: number;
    userId?: string;
    organizationId?: string;
    apiClientId?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const log: ApiRequestLog = {
      id: `log-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      ...data,
      timestamp: new Date(),
    };
    this.auditLogsStore.unshift(log);

    // Keep memory footprint reasonable
    if (this.auditLogsStore.length > 500) {
      this.auditLogsStore.pop();
    }
  }

  async listAuditLogs(filters?: { apiClientId?: string; endpoint?: string; limit?: number }) {
    let logs = [...this.auditLogsStore];
    if (filters?.apiClientId) logs = logs.filter((l) => l.apiClientId === filters.apiClientId);
    if (filters?.endpoint) logs = logs.filter((l) => l.endpoint.includes(filters.endpoint));

    return logs.slice(0, filters?.limit ?? 50);
  }
}

