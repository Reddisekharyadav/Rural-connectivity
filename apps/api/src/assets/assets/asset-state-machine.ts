import { BadRequestException } from '@nestjs/common';

export type AssetStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'UNDER_MAINTENANCE'
  | 'RENTED'
  | 'RESERVED'
  | 'DAMAGED'
  | 'RETIRED'
  | 'SUSPENDED';

export class AssetStateMachine {
  private static readonly VALID_TRANSITIONS: Record<AssetStatus, AssetStatus[]> = {
    ACTIVE: ['INACTIVE', 'UNDER_MAINTENANCE', 'RENTED', 'RESERVED', 'DAMAGED', 'SUSPENDED'],
    INACTIVE: ['ACTIVE', 'UNDER_MAINTENANCE', 'RETIRED'],
    UNDER_MAINTENANCE: ['ACTIVE', 'INACTIVE', 'DAMAGED', 'RETIRED'],
    RENTED: ['ACTIVE', 'DAMAGED', 'UNDER_MAINTENANCE'],
    RESERVED: ['ACTIVE', 'RENTED', 'INACTIVE'],
    DAMAGED: ['UNDER_MAINTENANCE', 'RETIRED'],
    RETIRED: [],
    SUSPENDED: ['ACTIVE', 'INACTIVE', 'RETIRED'],
  };

  static validateTransition(currentStatus: AssetStatus, targetStatus: AssetStatus): void {
    if (currentStatus === targetStatus) return;

    const allowed = this.VALID_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(targetStatus)) {
      throw new BadRequestException(
        `Invalid asset status transition from '${currentStatus}' to '${targetStatus}'. Allowed: [${allowed.join(', ')}]`
      );
    }
  }
}

