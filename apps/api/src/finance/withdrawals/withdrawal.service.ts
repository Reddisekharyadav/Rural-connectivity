import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { WalletService } from '../wallets/wallet.service';
import { LedgerService } from '../ledger/ledger.service';
import { FinancialAuditService } from '../audit/financial-audit.service';
import { PayoutDestinationService, PayoutDestination } from '../payouts/payout-destination.service';

export type WithdrawalStatus =
  | 'REQUESTED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'ON_HOLD';

export interface WithdrawalRequest {
  id: string;
  walletAccountId: string;
  userId: string;
  amount: number;
  currency: string;
  destinationId: string;
  destination?: PayoutDestination;
  status: WithdrawalStatus;
  requestedAt: Date;
  processedAt?: Date | null;
  failureReason?: string | null;
  externalReference?: string | null;
}

@Injectable()
export class WithdrawalService {
  private withdrawals: WithdrawalRequest[] = [];

  constructor(
    private readonly walletService: WalletService,
    private readonly ledgerService: LedgerService,
    private readonly auditService: FinancialAuditService,
    private readonly payoutService: PayoutDestinationService
  ) {}

  async requestWithdrawal(params: { userId: string; amount: number; destinationId: string }): Promise<WithdrawalRequest> {
    const wallet = await this.walletService.getOrCreateWallet(params.userId);
    if (wallet.status === 'FROZEN') {
      throw new BadRequestException('Wallet is frozen. Withdrawals are currently blocked.');
    }

    if ((wallet.balance?.availableBalance || 0) < params.amount) {
      throw new BadRequestException(
        `Insufficient available balance. Available: ₹${wallet.balance?.availableBalance || 0}, Requested: ₹${params.amount}`
      );
    }

    const destination = await this.payoutService.getDestinationById(params.destinationId);
    if (!destination) throw new NotFoundException('Payout destination not found');

    const withdrawal: WithdrawalRequest = {
      id: `wth-${Date.now()}`,
      walletAccountId: wallet.id,
      userId: params.userId,
      amount: params.amount,
      currency: 'INR',
      destinationId: params.destinationId,
      destination,
      status: 'REQUESTED',
      requestedAt: new Date(),
      processedAt: null,
      failureReason: null,
      externalReference: null,
    };

    this.withdrawals.unshift(withdrawal);

    await this.auditService.logAction({
      userId: params.userId,
      action: 'WITHDRAWAL_REQUESTED',
      resourceType: 'WITHDRAWAL',
      resourceId: withdrawal.id,
      newState: withdrawal,
    });

    return withdrawal;
  }

  async processWithdrawal(id: string, externalReference = 'UTR-BANK-2026-8832'): Promise<WithdrawalRequest> {
    const withdrawal = this.withdrawals.find((w) => w.id === id);
    if (!withdrawal) throw new NotFoundException('Withdrawal request not found');

    await this.ledgerService.postDoubleEntry({
      type: 'WITHDRAWAL',
      payerId: withdrawal.userId,
      amount: withdrawal.amount,
      referenceType: 'WITHDRAWAL',
      referenceId: withdrawal.id,
      category: 'WALLET_WITHDRAWAL',
      description: `Payout withdrawal to destination ref ${externalReference}`,
      entries: [
        {
          accountType: 'WALLET_AVAILABLE',
          accountId: withdrawal.userId,
          entryType: 'DEBIT',
          amount: withdrawal.amount,
        },
        {
          accountType: 'CUSTOMER_CLEARING',
          accountId: 'platform-treasury',
          entryType: 'CREDIT',
          amount: withdrawal.amount,
        },
      ],
    });

    withdrawal.status = 'COMPLETED';
    withdrawal.processedAt = new Date();
    withdrawal.externalReference = externalReference;

    await this.auditService.logAction({
      userId: withdrawal.userId,
      action: 'WITHDRAWAL_COMPLETED',
      resourceType: 'WITHDRAWAL',
      resourceId: id,
      newState: withdrawal,
    });

    return withdrawal;
  }

  async getWithdrawals(userId?: string): Promise<WithdrawalRequest[]> {
    if (userId) return this.withdrawals.filter((w) => w.userId === userId);
    return this.withdrawals;
  }

  async cancelWithdrawal(id: string, userId: string): Promise<WithdrawalRequest> {
    const withdrawal = this.withdrawals.find((w) => w.id === id && w.userId === userId);
    if (!withdrawal) throw new NotFoundException('Withdrawal not found');
    if (withdrawal.status !== 'REQUESTED') {
      throw new BadRequestException('Can only cancel withdrawals in REQUESTED status');
    }

    withdrawal.status = 'CANCELLED';
    return withdrawal;
  }
}

