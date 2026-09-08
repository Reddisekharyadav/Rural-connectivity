import { Injectable, Logger } from '@nestjs/common';
import { PlatformEventEnvelope } from '../event-envelope';

export interface ProcessedEvent {
  id: string;
  consumerId: string;
  eventId: string;
  processedAt: Date;
}

@Injectable()
export class EventConsumerService {
  private readonly logger = new Logger(EventConsumerService.name);
  private processedEventsStore: Map<string, ProcessedEvent> = new Map();

  /**
   * Executes an event consumer callback idempotently.
   * If the consumer has already processed this eventId, it skips execution safely.
   */
  async processEventIdempotently<T>(
    consumerId: string,
    event: PlatformEventEnvelope<T>,
    handler: (event: PlatformEventEnvelope<T>) => Promise<void>,
  ): Promise<{ status: 'PROCESSED' | 'SKIPPED_DUPLICATE'; eventId: string }> {
    const key = `${consumerId}:${event.eventId}`;

    if (this.processedEventsStore.has(key)) {
      this.logger.debug(
        `Consumer [${consumerId}] already processed event [${event.eventId}], skipping execution.`,
      );
      return { status: 'SKIPPED_DUPLICATE', eventId: event.eventId };
    }

    // Execute business logic handler
    await handler(event);

    // Record processed event
    const record: ProcessedEvent = {
      id: `proc-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      consumerId,
      eventId: event.eventId,
      processedAt: new Date(),
    };
    this.processedEventsStore.set(key, record);

    this.logger.log(`Consumer [${consumerId}] successfully processed event [${event.eventId}].`);
    return { status: 'PROCESSED', eventId: event.eventId };
  }

  /**
   * Checks if an event has been processed by a specific consumer
   */
  async isEventProcessed(consumerId: string, eventId: string): Promise<boolean> {
    const key = `${consumerId}:${eventId}`;
    return this.processedEventsStore.has(key);
  }
}
