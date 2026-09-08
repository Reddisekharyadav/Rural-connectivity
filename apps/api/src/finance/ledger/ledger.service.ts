import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { FinancialAuditService } from '../audit/financial-audit.service';

export type FinancialTransactionType =
  | 'PAYMENT'
  | 'REFUND'
  | 'EARNING'
  | 'SETTLEMENT'
  | 'COMMISSION'
  | 'ADJUSTMENT'
  | 'DEPOSIT'
  | 'DEPOSIT_REFUND'
  | 'DEPOSIT_FORFEIT'
  | 'WITHDRAWAL';

export type FinancialTransactionStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REVERSED'
  | 'DISPUTED';

export type FinancialCategory =
  | 'PRODUCE_SALE'
  | 'SERVICE_EARNING'
  | 'JOB_EARNING'
  | 'RENTAL_EARNING'
  | 'TRANSPORT_EARNING'
  | 'BUSINESS_SALE'
  | 'INPUT_PURCHASE'
  | 'MACHINERY_RENTAL'
  | 'WORKER_PAYMENT'
  | 'TRANSPORT'
  | 'REPAIR'
  | 'EQUIPMENT'
  | 'SERVICE'
  | 'WALLET_TOPUP'
  | 'WALLET_WITHDRAWAL'
  | 'SECURITY_DEPOSIT'
  | 'OTHER';

export type LedgerAccountType =
  | 'CUSTOMER_CLEARING'
  | 'PLATFORM_REVENUE'
  | 'PROVIDER_PAYABLE'
  | 'REFUND_SUSPENSE'
  | 'ESCROW_HOLD'
  | 'WALLET_AVAILABLE'
  | 'TREASURY';

export type LedgerEntryType = 'DEBIT' | 'CREDIT';

export interface LedgerEntry {
  id: string;
  transactionId: string;
  accountType: LedgerAccountType;
  accountId: string;
  entryType: LedgerEntryType;
  amount: number;
  currency: string;
  createdAt: Date;
}

export interface FinancialTransaction {
  id: string;
  type: FinancialTransactionType;
  status: FinancialTransactionStatus;
  payerId?: string | null;
  payeeId?: string | null;
  amount: number;
  currency: string;
  referenceType?: string | null;
  referenceId?: string | null;
  category: FinancialCategory;
  description?: string | null;
  metadata?: any;
  idempotencyKey?: string | null;
  createdAt: Date;
  updatedAt: Date;
  ledgerEntries: LedgerEntry[];
}

export interface LedgerPostingItem {
  accountType: LedgerAccountType;
  accountId: string;
  entryType: LedgerEntryType;
  amount: number;
}

@Injectable()
export class LedgerService {
  private readonly logger = new Logger(LedgerService.name);
  private transactions: FinancialTransaction[] = [];
  private ledgerEntries: LedgerEntry[] = [];

  constructor(private readonly auditService: FinancialAuditService) {
    this.seedSampleLedger();
  }

  private seedSampleLedger() {
    const txId = 'ftx-seed-001';
    const entries: LedgerEntry[] = [
      {
        id: 'ledg-seed-01',
        transactionId: txId,
        accountType: 'CUSTOMER_CLEARING',
        accountId: 'user-kiran-001',
        entryType: 'DEBIT',
        amount: 4000,
        currency: 'INR',
        createdAt: new Date(),
      },
      {
        id: 'ledg-seed-02',
        transactionId: txId,
        accountType: 'PLATFORM_REVENUE',
        accountId: 'platform-treasury',
        entryType: 'CREDIT',
        amount: 400,
        currency: 'INR',
        createdAt: new Date(),
      },
      {
        id: 'ledg-seed-03',
        transactionId: txId,
        accountType: 'WALLET_AVAILABLE',
        accountId: 'to-suresh-002',
        entryType: 'CREDIT',
        amount: 3600,
        currency: 'INR',
        createdAt: new Date(),
      },
    ];

    const tx: FinancialTransaction = {
      id: txId,
      type: 'PAYMENT',
      status: 'COMPLETED',
      payerId: 'user-kiran-001',
      payeeId: 'to-suresh-002',
      amount: 4000,
      currency: 'INR',
      referenceType: 'SERVICE_BOOKING',
      referenceId: 'TRW-000124',
      category: 'SERVICE_EARNING',
      description: 'Cotton Rotavator Operation Service',
      createdAt: new Date(),
      updatedAt: new Date(),
      ledgerEntries: entries,
    };

    this.transactions.push(tx);
    this.ledgerEntries.push(...entries);
  }

  async postDoubleEntry(params: {
    type: FinancialTransactionType;
    payerId?: string;
    payeeId?: string;
    amount: number;
    currency?: string;
    referenceType?: string;
    referenceId?: string;
    category?: FinancialCategory;
    description?: string;
    idempotencyKey?: string;
    metadata?: any;
    entries: LedgerPostingItem[];
  }): Promise<FinancialTransaction> {
    const currency = params.currency || 'INR';

    // 1. Verify Double-Entry Balance: sum(DEBIT) must equal sum(CREDIT)
    const totalDebit = params.entries
      .filter((e) => e.entryType === 'DEBIT')
      .reduce((sum, e) => sum + Math.round(e.amount * 100), 0);
    const totalCredit = params.entries
      .filter((e) => e.entryType === 'CREDIT')
      .reduce((sum, e) => sum + Math.round(e.amount * 100), 0);

    if (totalDebit !== totalCredit) {
      throw new BadRequestException(
        `Ledger imbalance: Total Debits (₹${totalDebit / 100}) does not equal Total Credits (₹${totalCredit / 100})`
      );
    }

    const txId = `ftx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const createdEntries: LedgerEntry[] = params.entries.map((e, idx) => ({
      id: `ledg-${Date.now()}-${idx + 1}`,
      transactionId: txId,
      accountType: e.accountType,
      accountId: e.accountId,
      entryType: e.entryType,
      amount: e.amount,
      currency,
      createdAt: new Date(),
    }));

    const tx: FinancialTransaction = {
      id: txId,
      type: params.type,
      status: 'COMPLETED',
      payerId: params.payerId,
      payeeId: params.payeeId,
      amount: params.amount,
      currency,
      referenceType: params.referenceType,
      referenceId: params.referenceId,
      category: params.category || 'OTHER',
      description: params.description,
      metadata: params.metadata || {},
      idempotencyKey: params.idempotencyKey,
      createdAt: new Date(),
      updatedAt: new Date(),
      ledgerEntries: createdEntries,
    };

    this.transactions.unshift(tx);
    this.ledgerEntries.unshift(...createdEntries);

    await this.auditService.logAction({
      userId: params.payerId || params.payeeId,
      action: 'LEDGER_POSTED',
      resourceType: 'TRANSACTION',
      resourceId: tx.id,
      newState: { txId: tx.id, amount: tx.amount, entriesCount: createdEntries.length },
    });

    return tx;
  }

  async getLedgerEntries(query?: { accountId?: string; accountType?: LedgerAccountType; limit?: number }) {
    let list = this.ledgerEntries;
    if (query?.accountId) list = list.filter((e) => e.accountId === query.accountId);
    if (query?.accountType) list = list.filter((e) => e.accountType === query.accountType);
    return list.slice(0, query?.limit || 100);
  }

  async getTransactions(query?: { userId?: string; limit?: number }) {
    let list = this.transactions;
    if (query?.userId) {
      list = list.filter((t) => t.payerId === query.userId || t.payeeId === query.userId);
    }
    return list.slice(0, query?.limit || 50);
  }

  async verifyIntegrity() {
    let debits = 0;
    let credits = 0;
    this.ledgerEntries.forEach((e) => {
      if (e.entryType === 'DEBIT') debits += Math.round(e.amount * 100);
      else credits += Math.round(e.amount * 100);
    });

    const isBalanced = debits === credits;
    return {
      totalEntries: this.ledgerEntries.length,
      totalDebits: debits / 100,
      totalCredits: credits / 100,
      isBalanced,
      difference: (debits - credits) / 100,
      status: isBalanced ? 'HEALTHY_BALANCED' : 'IMBALANCE_DETECTED',
    };
  }
}

