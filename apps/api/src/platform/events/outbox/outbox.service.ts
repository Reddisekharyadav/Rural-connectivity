import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '../../../events/event-bus.service';
import { buildPlatformEventEnvelope, PlatformEventEnvelope } from '../event-envelope';

export type OutboxStatus = 'PENDING' | 'PROCESSING' | 'PUBLISHED' | 'FAILED' | 'DEAD_LETTER';

export interface OutboxEvent {
  id: string;
  eventId: string;
  eventType: string;
  eventVersion: number;
  aggregateType: string;
  aggregateId: string;
  actorId?: string;
  organizationId?: string;
  correlationId?: string;
  causationId?: string;
  payload: any;
  status: OutboxStatus;
  attemptCount: number;
  maxAttempts: number;
  availableAt: Date;
  publishedAt?: Date | null;
  lastError?: string | null;
  createdAt: Date;
}

@Injectable()
export class OutboxService {
  private readonly logger = new Logger(OutboxService.name);
  private outboxStore: Map<string, OutboxEvent> = new Map();

  constructor(private readonly eventBus: EventBusService) {}

  /**
   * Records an outbox event in the atomic transactional store
   */
  async recordOutboxEvent<T>(
    eventType: string,
    aggregateType: string,
    aggregateId: string,
    payload: T,
    options?: {
      actorId?: string;
      organizationId?: string;
      correlationId?: string;
      causationId?: string;
      eventVersion?: number;
    },
  ): Promise<OutboxEvent> {
    const envelope = buildPlatformEventEnvelope(
      eventType,
      aggregateType,
      aggregateId,
      payload,
      options,
    );

    const outboxRecord: OutboxEvent = {
      id: `outbox-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      eventId: envelope.eventId,
      eventType: envelope.eventType,
      eventVersion: envelope.eventVersion,
      aggregateType: envelope.aggregateType,
      aggregateId: envelope.aggregateId,
      actorId: envelope.actorId,
      organizationId: envelope.organizationId,
      correlationId: envelope.correlationId,
      causationId: envelope.causationId,
      payload: envelope.payload,
      status: 'PENDING',
      attemptCount: 0,
      maxAttempts: 5,
      availableAt: new Date(),
      createdAt: new Date(),
    };

    this.outboxStore.set(outboxRecord.id, outboxRecord);
    this.logger.log(`Outbox event recorded: ${outboxRecord.eventId} [${outboxRecord.eventType}]`);
    return outboxRecord;
  }

  /**
   * Worker method to process pending outbox events and dispatch them to the Event Bus
   */
  async publishPendingOutboxEvents(batchSize: number = 50) {
    const now = new Date();
    const pendingEvents = Array.from(this.outboxStore.values())
      .filter(
        (e) =>
          (e.status === 'PENDING' || e.status === 'FAILED') &&
          e.availableAt <= now &&
          e.attemptCount < e.maxAttempts,
      )
      .slice(0, batchSize);

    let publishedCount = 0;
    let failedCount = 0;

    for (const record of pendingEvents) {
      record.status = 'PROCESSING';

      try {
        await this.eventBus.publish(record.eventType, {
          eventId: record.eventId,
          eventType: record.eventType,
          eventVersion: record.eventVersion,
          aggregateType: record.aggregateType,
          aggregateId: record.aggregateId,
          actorId: record.actorId,
          organizationId: record.organizationId,
          correlationId: record.correlationId,
          causationId: record.causationId,
          payload: record.payload,
          occurredAt: record.createdAt.toISOString(),
        });

        record.status = 'PUBLISHED';
        record.publishedAt = new Date();
        record.lastError = null;
        publishedCount++;
      } catch (err: any) {
        const nextAttempt = record.attemptCount + 1;
        const isDeadLetter = nextAttempt >= record.maxAttempts;
        const delayMs = Math.pow(2, nextAttempt) * 1000;

        record.status = isDeadLetter ? 'DEAD_LETTER' : 'FAILED';
        record.attemptCount = nextAttempt;
        record.availableAt = new Date(Date.now() + delayMs);
        record.lastError = err?.message || 'Unknown event publishing failure';

        this.logger.error(
          `Failed to publish outbox event ${record.eventId} (Attempt ${nextAttempt}): ${err?.message}`,
        );
        failedCount++;
      }
    }

    return { processed: pendingEvents.length, publishedCount, failedCount };
  }

  /**
   * Replays a dead letter event manually
   */
  async replayDeadLetterEvent(eventId: string): Promise<OutboxEvent> {
    const record = Array.from(this.outboxStore.values()).find((e) => e.eventId === eventId);
    if (!record) {
      throw new Error(`Outbox event with ID ${eventId} not found`);
    }

    record.status = 'PENDING';
    record.attemptCount = 0;
    record.availableAt = new Date();
    record.lastError = null;
    return record;
  }

  /**
   * Query outbox events with pagination & filtering
   */
  async getOutboxEvents(filters?: {
    status?: OutboxStatus;
    eventType?: string;
    aggregateType?: string;
    limit?: number;
    offset?: number;
  }) {
    let items = Array.from(this.outboxStore.values());
    if (filters?.status) items = items.filter((e) => e.status === filters.status);
    if (filters?.eventType) items = items.filter((e) => e.eventType === filters.eventType);
    if (filters?.aggregateType) items = items.filter((e) => e.aggregateType === filters.aggregateType);

    const total = items.length;
    const paginated = items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(filters?.offset || 0, (filters?.offset || 0) + (filters?.limit || 50));

    return { items: paginated, total };
  }
}
