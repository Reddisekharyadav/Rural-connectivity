import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { WalletBalanceService, WalletBalance } from './wallet-balance.service';
import { FinancialAuditService } from '../audit/financial-audit.service';
import { LedgerService } from '../ledger/ledger.service';
import { WalletHoldService, WalletHold } from '../holds/wallet-hold.service';

export type WalletAccountStatus = 'ACTIVE' | 'FROZEN' | 'SUSPENDED' | 'CLOSED';
export type TopUpStatus = 'CREATED' | 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED';

export interface WalletAccount {
  id: string;
  ownerId: string;
  currency: string;
  status: WalletAccountStatus;
  freezeReason?: string | null;
  frozenAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  balance?: WalletBalance;
  holds?: WalletHold[];
}

export interface TopUpRequest {
  id: string;
  walletAccountId: string;
  amount: number;
  currency: string;
  paymentId?: string | null;
  status: TopUpStatus;
  createdAt: Date;
  completedAt?: Date | null;
}

@Injectable()
export class WalletService {
  private wallets = new Map<string, WalletAccount>([
    [
      'user-kiran-001',
      {
        id: 'wallet-kiran-001',
        ownerId: 'user-kiran-001',
        currency: 'INR',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    [
      'to-suresh-002',
      {
        id: 'wallet-suresh-002',
        ownerId: 'to-suresh-002',
        currency: 'INR',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    [
      'wkr-mallesh-001',
      {
        id: 'wallet-mallesh-001',
        ownerId: 'wkr-mallesh-001',
        currency: 'INR',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  ]);

  private topUps = new Map<string, TopUpRequest>();

  constructor(
    private readonly balanceService: WalletBalanceService,
    private readonly auditService: FinancialAuditService,
    private readonly ledgerService: LedgerService,
    private readonly holdService: WalletHoldService
  ) {}

  async getOrCreateWallet(userId: string): Promise<WalletAccount> {
    let wallet = this.wallets.get(userId);
    if (!wallet) {
      wallet = {
        id: `wallet-${userId}`,
        ownerId: userId,
        currency: 'INR',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.wallets.set(userId, wallet);
    }

    const projection = await this.balanceService.calculateProjection(wallet.id, userId);
    const holds = await this.holdService.getHolds(wallet.id);

    return {
      ...wallet,
      balance: projection,
      holds,
    };
  }

  async freezeWallet(walletId: string, reason: string): Promise<WalletAccount> {
    let target: WalletAccount | undefined;
    for (const w of this.wallets.values()) {
      if (w.id === walletId || w.ownerId === walletId) {
        target = w;
        break;
      }
    }
    if (!target) throw new NotFoundException('Wallet not found');

    target.status = 'FROZEN';
    target.freezeReason = reason;
    target.frozenAt = new Date();
    target.updatedAt = new Date();

    await this.auditService.logAction({
      userId: target.ownerId,
      action: 'WALLET_FROZEN',
      resourceType: 'WALLET',
      resourceId: target.id,
      newState: { status: 'FROZEN', reason },
    });

    return target;
  }

  async unfreezeWallet(walletId: string): Promise<WalletAccount> {
    let target: WalletAccount | undefined;
    for (const w of this.wallets.values()) {
      if (w.id === walletId || w.ownerId === walletId) {
        target = w;
        break;
      }
    }
    if (!target) throw new NotFoundException('Wallet not found');

    target.status = 'ACTIVE';
    target.freezeReason = null;
    target.frozenAt = null;
    target.updatedAt = new Date();

    await this.auditService.logAction({
      userId: target.ownerId,
      action: 'WALLET_UNFROZEN',
      resourceType: 'WALLET',
      resourceId: target.id,
      newState: { status: 'ACTIVE' },
    });

    return target;
  }

  async createTopUp(userId: string, amount: number): Promise<TopUpRequest> {
    const wallet = await this.getOrCreateWallet(userId);
    if (wallet.status === 'FROZEN') throw new BadRequestException('Wallet is frozen');

    const topUp: TopUpRequest = {
      id: `topup-${Date.now()}`,
      walletAccountId: wallet.id,
      amount,
      currency: 'INR',
      paymentId: `pay_topup_${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date(),
      completedAt: null,
    };
    this.topUps.set(topUp.id, topUp);
    return topUp;
  }

  async confirmTopUp(topUpId: string, gatewayTxId: string): Promise<TopUpRequest> {
    const topUp = this.topUps.get(topUpId);
    if (!topUp) throw new NotFoundException('Top-up request not found');

    let ownerId = 'user-kiran-001';
    for (const w of this.wallets.values()) {
      if (w.id === topUp.walletAccountId) {
        ownerId = w.ownerId;
        break;
      }
    }

    await this.ledgerService.postDoubleEntry({
      type: 'PAYMENT',
      payerId: ownerId,
      payeeId: ownerId,
      amount: topUp.amount,
      referenceType: 'TOPUP',
      referenceId: topUp.id,
      category: 'WALLET_TOPUP',
      description: `Wallet Top-Up via ${gatewayTxId}`,
      entries: [
        {
          accountType: 'CUSTOMER_CLEARING',
          accountId: ownerId,
          entryType: 'DEBIT',
          amount: topUp.amount,
        },
        {
          accountType: 'WALLET_AVAILABLE',
          accountId: ownerId,
          entryType: 'CREDIT',
          amount: topUp.amount,
        },
      ],
    });

    topUp.status = 'SUCCEEDED';
    topUp.completedAt = new Date();
    return topUp;
  }
}
