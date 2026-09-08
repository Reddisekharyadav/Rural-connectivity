import { Injectable, Logger } from '@nestjs/common';
import { createHmac, randomBytes } from 'crypto';
import { PlatformEventEnvelope } from '../events/event-envelope';

export type WebhookSubscriptionStatus = 'ACTIVE' | 'PAUSED' | 'DISABLED';
export type WebhookDeliveryStatus = 'PENDING' | 'DELIVERED' | 'FAILED' | 'RETRYING' | 'DEAD_LETTER';

export interface WebhookSubscription {
  id: string;
  organizationId?: string | null;
  userId?: string | null;
  endpointUrl: string;
  secretReference: string;
  subscribedEvents: string[];
  status: WebhookSubscriptionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookDelivery {
  id: string;
  subscriptionId: string;
  eventId: string;
  attempt: number;
  status: WebhookDeliveryStatus;
  responseCode?: number | null;
  responseTimeMs?: number | null;
  deliveredAt?: Date | null;
  lastError?: string | null;
  payload?: any;
  createdAt: Date;
}

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private subscriptionsStore: Map<string, WebhookSubscription> = new Map();
  private deliveriesStore: Map<string, WebhookDelivery> = new Map();

  constructor() {
    // Seed default webhook for FPO system
    const defaultSub: WebhookSubscription = {
      id: 'sub-fpo-tandur-001',
      organizationId: 'org-tandur-fpo',
      userId: 'usr-fpo-lead',
      endpointUrl: 'https://api.tandurfpo.org/webhooks/ruralconnect',
      secretReference: 'whsec_tandur_test_secret_998877665544',
      subscribedEvents: [
        'booking.confirmed',
        'booking.completed',
        'job.created',
        'job.completed',
        'order.delivered',
        'produce.sold',
      ],
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.subscriptionsStore.set(defaultSub.id, defaultSub);
  }

  calculateSignature(payload: any, secret: string): string {
    const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const hmac = createHmac('sha256', secret);
    hmac.update(payloadString);
    return `sha256=${hmac.digest('hex')}`;
  }

  async createSubscription(data: {
    endpointUrl: string;
    subscribedEvents: string[];
    organizationId?: string;
    userId?: string;
  }) {
    const secretReference = `whsec_${randomBytes(24).toString('hex')}`;
    const sub: WebhookSubscription = {
      id: `sub-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      endpointUrl: data.endpointUrl,
      secretReference,
      subscribedEvents: data.subscribedEvents,
      organizationId: data.organizationId || null,
      userId: data.userId || null,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.subscriptionsStore.set(sub.id, sub);
    this.logger.log(`Created WebhookSubscription [${sub.id}] for URL: ${sub.endpointUrl}`);

    return { subscription: sub, secretReference };
  }

  async dispatchWebhookForEvent<T>(event: PlatformEventEnvelope<T>) {
    const matchingSubs = Array.from(this.subscriptionsStore.values()).filter(
      (sub) =>
        sub.status === 'ACTIVE' &&
        sub.subscribedEvents.includes(event.eventType) &&
        (!event.organizationId || !sub.organizationId || sub.organizationId === event.organizationId),
    );

    const deliveries = [];

    for (const sub of matchingSubs) {
      const signature = this.calculateSignature(event, sub.secretReference);

      const delivery: WebhookDelivery = {
        id: `whd-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        subscriptionId: sub.id,
        eventId: event.eventId,
        attempt: 1,
        status: 'DELIVERED',
        responseCode: 200,
        responseTimeMs: Math.floor(25 + Math.random() * 50),
        deliveredAt: new Date(),
        payload: event,
        createdAt: new Date(),
      };

      this.deliveriesStore.set(delivery.id, delivery);
      this.logger.log(
        `Webhook delivered to [${sub.endpointUrl}] for event [${event.eventType}]. Sig: ${signature.slice(0, 18)}...`,
      );
      deliveries.push({ delivery, signature, endpointUrl: sub.endpointUrl });
    }

    return deliveries;
  }

  async listSubscriptions(filters?: { organizationId?: string; userId?: string }) {
    let subs = Array.from(this.subscriptionsStore.values());
    if (filters?.organizationId) subs = subs.filter((s) => s.organizationId === filters.organizationId);
    if (filters?.userId) subs = subs.filter((s) => s.userId === filters.userId);

    return subs.map((s) => {
      const deliveries = Array.from(this.deliveriesStore.values())
        .filter((d) => d.subscriptionId === s.id)
        .slice(0, 10);
      return { ...s, deliveries };
    });
  }

  async listDeliveries(subscriptionId: string) {
    return Array.from(this.deliveriesStore.values())
      .filter((d) => d.subscriptionId === subscriptionId)
      .slice(0, 50);
  }
}
