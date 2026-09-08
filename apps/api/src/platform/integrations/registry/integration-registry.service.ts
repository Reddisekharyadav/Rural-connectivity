import { Injectable, Logger } from '@nestjs/common';
import { IntegrationType, IntegrationAdapter } from '../adapters/integration-adapter.interface';
import { LogisticsAdapter } from '../adapters/logistics.adapter';
import { PaymentsAdapter } from '../adapters/payments.adapter';
import { FpoAdapter } from '../adapters/fpo.adapter';
import { AgricultureAdapter } from '../adapters/agriculture.adapter';
import { MessagingAdapter } from '../adapters/messaging.adapter';

@Injectable()
export class IntegrationRegistryService {
  private readonly logger = new Logger(IntegrationRegistryService.name);
  private adapters: Map<IntegrationType, IntegrationAdapter> = new Map();

  constructor(
    private readonly logisticsAdapter: LogisticsAdapter,
    private readonly paymentsAdapter: PaymentsAdapter,
    private readonly fpoAdapter: FpoAdapter,
    private readonly agricultureAdapter: AgricultureAdapter,
    private readonly messagingAdapter: MessagingAdapter,
  ) {
    this.registerAdapter(logisticsAdapter);
    this.registerAdapter(paymentsAdapter);
    this.registerAdapter(fpoAdapter);
    this.registerAdapter(agricultureAdapter);
    this.registerAdapter(messagingAdapter);
  }

  registerAdapter(adapter: IntegrationAdapter) {
    this.adapters.set(adapter.type, adapter);
    this.logger.log(`Registered adapter for type [${adapter.type}]: ${adapter.name}`);
  }

  getAdapter(type: IntegrationType): IntegrationAdapter | undefined {
    return this.adapters.get(type);
  }

  getAllAdapters(): IntegrationAdapter[] {
    return Array.from(this.adapters.values());
  }
}

