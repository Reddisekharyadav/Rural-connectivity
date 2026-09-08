import { Injectable, NotFoundException } from '@nestjs/common';
import {
  LedgerService,
  FinancialTransaction,
  FinancialCategory,
  FinancialTransactionType,
  FinancialTransactionStatus,
} from '../ledger/ledger.service';

@Injectable()
export class FinancialTransactionService {
  constructor(private readonly ledgerService: LedgerService) {}

  async getTransactions(query?: {
    userId?: string;
    type?: FinancialTransactionType;
    status?: FinancialTransactionStatus;
    category?: FinancialCategory;
    referenceType?: string;
    limit?: number;
  }): Promise<FinancialTransaction[]> {
    let list = await this.ledgerService.getTransactions({ userId: query?.userId, limit: 1000 });
    if (query?.type) list = list.filter((t) => t.type === query.type);
    if (query?.status) list = list.filter((t) => t.status === query.status);
    if (query?.category) list = list.filter((t) => t.category === query.category);
    if (query?.referenceType) list = list.filter((t) => t.referenceType === query.referenceType);
    return list.slice(0, query?.limit || 50);
  }

  async getTransactionById(id: string): Promise<FinancialTransaction> {
    const list = await this.ledgerService.getTransactions({ limit: 1000 });
    const tx = list.find((t) => t.id === id);
    if (!tx) throw new NotFoundException('Transaction not found');
    return tx;
  }
}
