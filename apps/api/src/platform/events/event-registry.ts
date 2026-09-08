/**
 * Domain Event Registry for RuralConnect Platform
 * Defines standard domain event types, aggregate mappings, and supported versions.
 */

export interface EventDefinition {
  eventType: string;
  aggregateType: string;
  currentVersion: number;
  description: string;
}

export const DOMAIN_EVENT_REGISTRY: Record<string, EventDefinition> = {
  // Booking Domain
  'booking.created': {
    eventType: 'booking.created',
    aggregateType: 'Booking',
    currentVersion: 1,
    description: 'Triggered when a service booking is initialized',
  },
  'booking.confirmed': {
    eventType: 'booking.confirmed',
    aggregateType: 'Booking',
    currentVersion: 1,
    description: 'Triggered when provider confirms booking request',
  },
  'booking.cancelled': {
    eventType: 'booking.cancelled',
    aggregateType: 'Booking',
    currentVersion: 1,
    description: 'Triggered when booking is cancelled by customer or provider',
  },
  'booking.completed': {
    eventType: 'booking.completed',
    aggregateType: 'Booking',
    currentVersion: 1,
    description: 'Triggered when work session is completed and signed off',
  },

  // Workforce Domain
  'job.created': {
    eventType: 'job.created',
    aggregateType: 'JobPosting',
    currentVersion: 1,
    description: 'Triggered when a workforce job posting is created',
  },
  'job.assigned': {
    eventType: 'job.assigned',
    aggregateType: 'JobAssignment',
    currentVersion: 1,
    description: 'Triggered when workers are assigned/shortlisted to a job',
  },
  'job.completed': {
    eventType: 'job.completed',
    aggregateType: 'JobPosting',
    currentVersion: 1,
    description: 'Triggered when all attendance records are verified and paid',
  },

  // Machinery & Asset Rental Domain
  'rental.created': {
    eventType: 'rental.created',
    aggregateType: 'RentalBooking',
    currentVersion: 1,
    description: 'Triggered when an equipment rental reservation is created',
  },
  'rental.handed_over': {
    eventType: 'rental.handed_over',
    aggregateType: 'RentalBooking',
    currentVersion: 1,
    description: 'Triggered when equipment is handed over with initial meter reading',
  },
  'rental.returned': {
    eventType: 'rental.returned',
    aggregateType: 'RentalBooking',
    currentVersion: 1,
    description: 'Triggered when equipment is returned and inspected',
  },

  // Local Commerce Domain
  'order.created': {
    eventType: 'order.created',
    aggregateType: 'CommerceOrder',
    currentVersion: 1,
    description: 'Triggered when a buyer places a commercial product order',
  },
  'order.confirmed': {
    eventType: 'order.confirmed',
    aggregateType: 'CommerceOrder',
    currentVersion: 1,
    description: 'Triggered when merchant accepts and reserves inventory',
  },
  'order.delivered': {
    eventType: 'order.delivered',
    aggregateType: 'CommerceOrder',
    currentVersion: 1,
    description: 'Triggered when goods are handed over or delivered to farm',
  },

  // Financial Domain
  'payment.created': {
    eventType: 'payment.created',
    aggregateType: 'FinancialTransaction',
    currentVersion: 1,
    description: 'Triggered when a payment intent is initiated',
  },
  'payment.succeeded': {
    eventType: 'payment.succeeded',
    aggregateType: 'FinancialTransaction',
    currentVersion: 1,
    description: 'Triggered when payment is settled in ledger',
  },
  'payment.failed': {
    eventType: 'payment.failed',
    aggregateType: 'FinancialTransaction',
    currentVersion: 1,
    description: 'Triggered when payment gateway or ledger rejects transaction',
  },
  'settlement.created': {
    eventType: 'settlement.created',
    aggregateType: 'Settlement',
    currentVersion: 1,
    description: 'Triggered when provider earnings are batched for settlement',
  },
  'settlement.completed': {
    eventType: 'settlement.completed',
    aggregateType: 'Settlement',
    currentVersion: 1,
    description: 'Triggered when bank/UPI transfer is completed with UTR',
  },

  // Produce Domain
  'produce.listed': {
    eventType: 'produce.listed',
    aggregateType: 'ProduceListing',
    currentVersion: 1,
    description: 'Triggered when harvest produce is listed on the exchange',
  },
  'produce.sold': {
    eventType: 'produce.sold',
    aggregateType: 'ProduceOrder',
    currentVersion: 1,
    description: 'Triggered when buyer offer is accepted and contract signed',
  },

  // Logistics Domain
  'transport.created': {
    eventType: 'transport.created',
    aggregateType: 'TransportRequest',
    currentVersion: 1,
    description: 'Triggered when freight transport is requested',
  },
  'transport.started': {
    eventType: 'transport.started',
    aggregateType: 'TransportBooking',
    currentVersion: 1,
    description: 'Triggered when vehicle departs origin with cargo',
  },
  'transport.delivered': {
    eventType: 'transport.delivered',
    aggregateType: 'TransportBooking',
    currentVersion: 1,
    description: 'Triggered when destination pod is signed',
  },
};
