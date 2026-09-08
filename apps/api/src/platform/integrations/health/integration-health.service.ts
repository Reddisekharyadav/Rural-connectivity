import { Injectable, Logger } from '@nestjs/common';
import { IntegrationRegistryService } from '../registry/integration-registry.service';

@Injectable()
export class IntegrationHealthService {
  private readonly logger = new Logger(IntegrationHealthService.name);

  constructor(private readonly registry: IntegrationRegistryService) {}

  /**
   * Executes a health check across all registered integration adapters
   */
  async checkAllIntegrationsHealth() {
    const adapters = this.registry.getAllAdapters();
    const results = [];

    for (const adapter of adapters) {
      try {
        const health = await adapter.healthCheck();
        results.push({
          type: adapter.type,
          name: adapter.name,
          status: health.status,
          latencyMs: health.latencyMs,
          errorRate: health.errorRate,
          message: health.message,
          lastCheckedAt: new Date().toISOString(),
        });
      } catch (err: any) {
        results.push({
          type: adapter.type,
          name: adapter.name,
          status: 'DOWN',
          latencyMs: 999.0,
          errorRate: 1.0,
          message: err?.message,
          lastCheckedAt: new Date().toISOString(),
        });
      }
    }

    return results;
  }
}

