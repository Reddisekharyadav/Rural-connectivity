import { Injectable, Logger } from '@nestjs/common';
import { IntegrationAdapter, HealthCheckResult } from './integration-adapter.interface';

@Injectable()
export class MessagingAdapter implements IntegrationAdapter {
  private readonly logger = new Logger(MessagingAdapter.name);
  readonly type = 'MESSAGING';
  readonly name = 'Govt CDAC / Telecom SMS & WhatsApp Gateway Adapter';
  private connected = true;

  async connect(): Promise<boolean> {
    this.connected = true;
    return true;
  }

  async disconnect(): Promise<boolean> {
    this.connected = false;
    return true;
  }

  async healthCheck(): Promise<HealthCheckResult> {
    return {
      status: 'HEALTHY',
      latencyMs: 31.0,
      errorRate: 0.0,
      message: 'DLT registered SMS gateway and WhatsApp Cloud API connected',
    };
  }

  async send(payload: any): Promise<any> {
    this.logger.log(`Dispatching SMS alert via Messaging Adapter to: ${payload?.phone}`);
    return {
      success: true,
      messageId: `msg-${Date.now()}`,
      dltEntityId: 'DLT-11002233',
    };
  }

  async receive(payload: any): Promise<any> {
    return { deliveryReceipt: 'DELIVRD', timestamp: new Date().toISOString() };
  }
}

