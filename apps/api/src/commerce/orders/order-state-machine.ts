import { BadRequestException } from '@nestjs/common';

export type CommerceOrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

export class OrderStateMachine {
  private static readonly ALLOWED_TRANSITIONS: Record<CommerceOrderStatus, CommerceOrderStatus[]> = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['PROCESSING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'CANCELLED'],
    PROCESSING: ['READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'CANCELLED'],
    READY_FOR_PICKUP: ['DELIVERED', 'COMPLETED', 'DISPUTED'],
    OUT_FOR_DELIVERY: ['DELIVERED', 'DISPUTED'],
    DELIVERED: ['COMPLETED', 'DISPUTED'],
    DISPUTED: ['COMPLETED', 'CANCELLED'],
    COMPLETED: [],
    CANCELLED: [],
  };

  static validateTransition(current: CommerceOrderStatus, next: CommerceOrderStatus): void {
    if (current === next) return;

    const allowed = this.ALLOWED_TRANSITIONS[current] || [];
    if (!allowed.includes(next)) {
      throw new BadRequestException(
        `Invalid commerce order transition from '${current}' to '${next}'. Allowed next states: [${allowed.join(', ')}]`,
      );
    }
  }
}

