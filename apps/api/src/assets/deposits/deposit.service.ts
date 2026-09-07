import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

export type DepositStatus =
  | 'NOT_REQUIRED'
  | 'PENDING'
  | 'HELD'
  | 'PARTIALLY_REFUNDED'
  | 'REFUNDED'
  | 'PARTIALLY_FORFEITED'
  | 'FORFEITED';

export interface ResolveDepositDto {
  refundAmount: number;
  forfeitAmount: number;
  reason?: string;
}

@Injectable()
export class RentalDepositService {
  private deposits = new Map<string, any>([
    [
      'bkg-001',
      {
        id: 'dep-001',
        rentalBookingId: 'bkg-001',
        amount: 2000,
        currency: 'INR',
        status: 'HELD' as DepositStatus,
        refundedAmount: 0,
        forfeitedAmount: 0,
        reason: 'Security deposit held in escrow for implement damage safety.',
        createdAt: new Date('2026-09-08T09:00:00Z'),
      },
    ],
  ]);

  async getDepositByBookingId(rentalBookingId: string): Promise<any> {
    const deposit = this.deposits.get(rentalBookingId);
    if (!deposit) throw new NotFoundException(`RentalDeposit for booking '${rentalBookingId}' not found`);
    return deposit;
  }

  async refundDeposit(rentalBookingId: string, reason?: string): Promise<any> {
    const deposit = await this.getDepositByBookingId(rentalBookingId);
    if (deposit.status !== 'HELD') {
      throw new BadRequestException(`Deposit is in '${deposit.status}' state and cannot be refunded`);
    }

    deposit.status = 'REFUNDED';
    deposit.refundedAmount = deposit.amount;
    deposit.forfeitedAmount = 0;
    deposit.reason = reason || 'Asset returned in good condition. 100% deposit refunded.';
    deposit.updatedAt = new Date();

    return deposit;
  }

  async resolveDamageAdjustment(rentalBookingId: string, dto: ResolveDepositDto): Promise<any> {
    const deposit = await this.getDepositByBookingId(rentalBookingId);
    if (deposit.status !== 'HELD') {
      throw new BadRequestException(`Deposit is in '${deposit.status}' state and cannot be adjusted`);
    }

    const total = dto.refundAmount + dto.forfeitAmount;
    if (total > deposit.amount) {
      throw new BadRequestException(
        `Sum of refund (${dto.refundAmount}) and forfeit (${dto.forfeitAmount}) cannot exceed total deposit (${deposit.amount})`
      );
    }

    let nextStatus: DepositStatus = 'REFUNDED';
    if (dto.forfeitAmount === deposit.amount) nextStatus = 'FORFEITED';
    else if (dto.forfeitAmount > 0 && dto.refundAmount > 0) nextStatus = 'PARTIALLY_REFUNDED';
    else if (dto.forfeitAmount > 0) nextStatus = 'PARTIALLY_FORFEITED';

    deposit.status = nextStatus;
    deposit.refundedAmount = dto.refundAmount;
    deposit.forfeitedAmount = dto.forfeitAmount;
    deposit.reason = dto.reason || 'Deposit adjusted based on post-rental damage inspection.';
    deposit.updatedAt = new Date();

    return deposit;
  }
}

