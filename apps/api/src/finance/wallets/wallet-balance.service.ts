import { Injectable } from '@nestjs/common';
import { LedgerService } from '../ledger/ledger.service';
import { WalletHoldService } from '../holds/wallet-hold.service';

export interface WalletBalance {
  id: string;
  walletAccountId: string;
  availableBalance: number;
  pendingBalance: number;
  heldBalance: number;
  currency: string;
  lastCalculatedAt: Date;
}

@Injectable()
export class WalletBalanceService {
  private balances = new Map<string, WalletBalance>();

  constructor(
    private readonly ledgerService: LedgerService,
    private readonly holdService: WalletHoldService
  ) {}

  async calculateProjection(walletAccountId: string, userId: string): Promise<WalletBalance> {
    const entries = await this.ledgerService.getLedgerEntries({ accountId: userId, limit: 1000 });

    let availableCredits = 0;
    let availableDebits = 0;
    let pendingAmount = 0;

    for (const e of entries) {
      if (e.accountType === 'WALLET_AVAILABLE' || e.accountType === 'CUSTOMER_CLEARING') {
        if (e.entryType === 'CREDIT') availableCredits += e.amount;
        if (e.entryType === 'DEBIT') availableDebits += e.amount;
      } else if (e.accountType === 'PROVIDER_PAYABLE' || e.accountType === 'ESCROW_HOLD') {
        if (e.entryType === 'CREDIT') pendingAmount += e.amount;
      }
    }

    const heldBalance = await this.holdService.getActiveHoldAmount(walletAccountId);
    const grossAvailable = Math.max(0, availableCredits - availableDebits);
    const netAvailable = Math.max(0, grossAvailable - heldBalance);

    const balance: WalletBalance = {
      id: `bal-${walletAccountId}`,
      walletAccountId,
      availableBalance: Math.round(netAvailable * 100) / 100,
      pendingBalance: Math.round(pendingAmount * 100) / 100,
      heldBalance: Math.round(heldBalance * 100) / 100,
      currency: 'INR',
      lastCalculatedAt: new Date(),
    };

    this.balances.set(walletAccountId, balance);
    return balance;
  }
}

