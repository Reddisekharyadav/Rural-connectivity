import { BadRequestException } from '@nestjs/common';

export type RentalBookingStatus =
  | 'CONFIRMED'
  | 'READY'
  | 'HANDED_OVER'
  | 'IN_USE'
  | 'RETURN_PENDING'
  | 'RETURNED'
  | 'INSPECTED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

export class RentalBookingStateMachine {
  private static readonly VALID_TRANSITIONS: Record<RentalBookingStatus, RentalBookingStatus[]> = {
    CONFIRMED: ['READY', 'HANDED_OVER', 'CANCELLED', 'DISPUTED'],
    READY: ['HANDED_OVER', 'CANCELLED', 'DISPUTED'],
    HANDED_OVER: ['IN_USE', 'RETURN_PENDING', 'DISPUTED'],
    IN_USE: ['RETURN_PENDING', 'RETURNED', 'DISPUTED'],
    RETURN_PENDING: ['RETURNED', 'DISPUTED'],
    RETURNED: ['INSPECTED', 'COMPLETED', 'DISPUTED'],
    INSPECTED: ['COMPLETED', 'DISPUTED'],
    COMPLETED: [],
    CANCELLED: [],
    DISPUTED: ['COMPLETED', 'CANCELLED', 'INSPECTED'],
  };

  static validateTransition(currentStatus: RentalBookingStatus, targetStatus: RentalBookingStatus): void {
    if (currentStatus === targetStatus) return;

    const allowed = this.VALID_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(targetStatus)) {
      throw new BadRequestException(
        `Invalid rental booking state transition from '${currentStatus}' to '${targetStatus}'. Allowed: [${allowed.join(', ')}]`
      );
    }
  }
}

