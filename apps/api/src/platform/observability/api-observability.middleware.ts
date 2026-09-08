import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';
import { PlatformAuditService } from './platform-audit.service';

@Injectable()
export class ApiObservabilityMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  constructor(private readonly auditService: PlatformAuditService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const requestId = (req.headers['x-request-id'] as string) || `req_${randomBytes(8).toString('hex')}`;
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-Id', requestId);

    res.on('finish', () => {
      const latencyMs = Date.now() - startTime;
      const statusCode = res.statusCode;
      const { method, originalUrl } = req;
      const apiClient = (req as any).apiClient;

      this.logger.log(`[${requestId}] ${method} ${originalUrl} ${statusCode} - ${latencyMs}ms`);

      this.auditService.logApiRequest({
        requestId,
        endpoint: originalUrl,
        httpMethod: method,
        statusCode,
        latencyMs,
        apiClientId: apiClient?.apiClientId,
        organizationId: apiClient?.organizationId,
        userId: apiClient?.userId,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      }).catch(() => {});
    });

    next();
  }
}
