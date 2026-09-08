/**
 * Standard RuralConnect Platform Event Envelope (Milestone 23)
 * Provides an immutable contract across all internal domains and external partner webhooks/integrations.
 */

export interface EventEnvelope<T = any> {
  eventId: string;
  eventType: string;          // e.g. "booking.confirmed", "job.created", "order.delivered"
  eventVersion: number;       // e.g. 1
  occurredAt: string;         // ISO 8601 string
  actorId?: string;           // User or system actor ID
  organizationId?: string;    // FPO / Govt / Partner Org ID
  aggregateType: string;      // "Booking", "WorkRequest", "Order", "Payment", "Produce", etc.
  aggregateId: string;        // ID of the aggregate root
  correlationId?: string;     // Distributed tracing correlation ID
  causationId?: string;       // Direct trigger event ID
  payload: T;
}

export function createEventEnvelope<T>(
  eventType: string,
  aggregateType: string,
  aggregateId: string,
  payload: T,
  options?: {
    eventVersion?: number;
    actorId?: string;
    organizationId?: string;
    correlationId?: string;
    causationId?: string;
  }
): EventEnvelope<T> {
  const timestamp = new Date().toISOString();
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const eventId = `evt-${Date.now()}-${randomSuffix}`;

  return {
    eventId,
    eventType,
    eventVersion: options?.eventVersion ?? 1,
    occurredAt: timestamp,
    actorId: options?.actorId,
    organizationId: options?.organizationId,
    aggregateType,
    aggregateId,
    correlationId: options?.correlationId ?? eventId,
    causationId: options?.causationId,
    payload,
  };
}
