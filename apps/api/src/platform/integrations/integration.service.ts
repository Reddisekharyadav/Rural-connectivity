import { Injectable, Logger } from '@nestjs/common';
import { IntegrationType } from './adapters/integration-adapter.interface';
import { IntegrationRegistryService } from './registry/integration-registry.service';
import { IntegrationHealthService } from './health/integration-health.service';

export type IntegrationStatus = 'ACTIVE' | 'INACTIVE' | 'ERROR';

export interface IntegrationRecord {
  id: string;
  name: string;
  type: IntegrationType;
  organizationId?: string | null;
  configurationReference?: string | null;
  status: IntegrationStatus;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class IntegrationService {
  private readonly logger = new Logger(IntegrationService.name);
  private integrationsStore: Map<string, IntegrationRecord> = new Map();

  constructor(
    private readonly registry: IntegrationRegistryService,
    private readonly healthService: IntegrationHealthService,
  ) {
    const defaultIntegrations: IntegrationRecord[] = [
      {
        id: 'intg-fpo-erp-001',
        name: 'Tandur FPO Custom ERP Connector',
        type: 'FPO',
        organizationId: 'org-tandur-fpo',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'intg-delhivery-001',
        name: 'Delhivery Rural Logistics Partner',
        type: 'LOGISTICS',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'intg-rzp-001',
        name: 'Razorpay NPCI Settlement Router',
        type: 'PAYMENTS',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const intg of defaultIntegrations) {
      this.integrationsStore.set(intg.id, intg);
    }
  }

  async createIntegration(data: {
    name: string;
    type: IntegrationType;
    organizationId?: string;
    configurationReference?: string;
  }) {
    const record: IntegrationRecord = {
      id: `intg-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: data.name,
      type: data.type,
      organizationId: data.organizationId || null,
      configurationReference: data.configurationReference || null,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.integrationsStore.set(record.id, record);
    return record;
  }

  async listIntegrations(filters?: { organizationId?: string }) {
    let list = Array.from(this.integrationsStore.values());
    if (filters?.organizationId) {
      list = list.filter((i) => i.organizationId === filters.organizationId);
    }
    return list;
  }

  async getHealthStatus() {
    return this.healthService.checkAllIntegrationsHealth();
  }
}

