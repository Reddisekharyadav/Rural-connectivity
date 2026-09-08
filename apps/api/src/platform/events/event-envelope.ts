import { createHash } from 'crypto';

export interface PlatformEventEnvelope<T = any> {
  eventId: string;
  eventType: string;
  eventVersion: number;
  occurredAt: string;
  actorId?: string;
  organizationId?: string;
  aggregateType: string;
  aggregateId: string;
  correlationId?: string;
  causationId?: string;
  payload: T;
}

export function buildPlatformEventEnvelope<T>(
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
): PlatformEventEnvelope<T> {
  const timestamp = new Date().toISOString();
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const eventId = `evt-${Date.now()}-${randomSuffix}`;

  return {
    eventId,
    eventType: eventType.toLowerCase(),
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
