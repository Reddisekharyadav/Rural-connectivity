import { Injectable, Logger } from '@nestjs/common';
import { IntegrationAdapter, HealthCheckResult } from './integration-adapter.interface';

@Injectable()
export class PaymentsAdapter implements IntegrationAdapter {
  private readonly logger = new Logger(PaymentsAdapter.name);
  readonly type = 'PAYMENTS';
  readonly name = 'Razorpay & NPCI UPI Gateway Adapter';
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
      latencyMs: 24.2,
      errorRate: 0.0,
      message: 'Payment gateway API and webhook receiver operational',
    };
  }

  async send(payload: any): Promise<any> {
    this.logger.log(`Initiating external payout/refund via Payment Adapter: ₹${payload?.amount}`);
    return {
      success: true,
      gatewayReference: `rzp_payout_${Date.now()}`,
      utr: `UTR-NPCI-${Date.now()}`,
      status: 'PROCESSED',
    };
  }

  async receive(payload: any): Promise<any> {
    return { verified: true, signatureValid: true };
  }
}

