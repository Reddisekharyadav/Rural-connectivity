import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FinancialAuditService } from '../audit/financial-audit.service';

export type WalletHoldReason =
  | 'RENTAL_DEPOSIT'
  | 'DISPUTE'
  | 'PENDING_SETTLEMENT'
  | 'REFUND_PENDING'
  | 'RISK_REVIEW';

export type WalletHoldStatus = 'ACTIVE' | 'RELEASED' | 'CAPTURED' | 'EXPIRED';

export interface WalletHold {
  id: string;
  walletAccountId: string;
  amount: number;
  currency: string;
  reason: WalletHoldReason;
  referenceType?: string | null;
  referenceId?: string | null;
  status: WalletHoldStatus;
  createdAt: Date;
  releasedAt?: Date | null;
}

@Injectable()
export class WalletHoldService {
  private holds: WalletHold[] = [
    {
      id: 'hold-sample-001',
      walletAccountId: 'wallet-kiran-001',
      amount: 2000,
      currency: 'INR',
      reason: 'RENTAL_DEPOSIT',
      referenceType: 'RENTAL_BOOKING',
      referenceId: 'RB-2026-9901',
      status: 'ACTIVE',
      createdAt: new Date(),
      releasedAt: null,
    },
  ];

  constructor(private readonly auditService: FinancialAuditService) {}

  async createHold(params: {
    walletAccountId: string;
    amount: number;
    reason: WalletHoldReason;
    referenceType?: string;
    referenceId?: string;
    currency?: string;
  }): Promise<WalletHold> {
    const hold: WalletHold = {
      id: `hold-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      walletAccountId: params.walletAccountId,
      amount: params.amount,
      currency: params.currency || 'INR',
      reason: params.reason,
      referenceType: params.referenceType,
      referenceId: params.referenceId,
      status: 'ACTIVE',
      createdAt: new Date(),
      releasedAt: null,
    };
    this.holds.unshift(hold);

    await this.auditService.logAction({
      action: 'WALLET_HOLD_CREATED',
      resourceType: 'WALLET_HOLD',
      resourceId: hold.id,
      newState: hold,
    });

    return hold;
  }

  async releaseHold(holdId: string): Promise<WalletHold> {
    const hold = this.holds.find((h) => h.id === holdId);
    if (!hold) throw new NotFoundException('Hold not found');
    if (hold.status !== 'ACTIVE') throw new BadRequestException(`Cannot release hold with status ${hold.status}`);

    hold.status = 'RELEASED';
    hold.releasedAt = new Date();

    await this.auditService.logAction({
      action: 'WALLET_HOLD_RELEASED',
      resourceType: 'WALLET_HOLD',
      resourceId: holdId,
      newState: hold,
    });

    return hold;
  }

  async captureHold(holdId: string): Promise<WalletHold> {
    const hold = this.holds.find((h) => h.id === holdId);
    if (!hold) throw new NotFoundException('Hold not found');
    if (hold.status !== 'ACTIVE') throw new BadRequestException(`Cannot capture hold with status ${hold.status}`);

    hold.status = 'CAPTURED';
    hold.releasedAt = new Date();

    await this.auditService.logAction({
      action: 'WALLET_HOLD_CAPTURED',
      resourceType: 'WALLET_HOLD',
      resourceId: holdId,
      newState: hold,
    });

    return hold;
  }

  async getHolds(walletAccountId: string, status?: WalletHoldStatus): Promise<WalletHold[]> {
    let list = this.holds.filter((h) => h.walletAccountId === walletAccountId);
    if (status) list = list.filter((h) => h.status === status);
    return list;
  }

  async getActiveHoldAmount(walletAccountId: string): Promise<number> {
    const active = this.holds.filter((h) => h.walletAccountId === walletAccountId && h.status === 'ACTIVE');
    return active.reduce((sum, h) => sum + h.amount, 0);
  }
}
