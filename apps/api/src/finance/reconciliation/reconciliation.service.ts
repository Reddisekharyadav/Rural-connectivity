import { Injectable, Logger } from '@nestjs/common';
import { LedgerService } from '../ledger/ledger.service';

export type ReconciliationStatus =
  | 'MATCHED'
  | 'MISMATCHED'
  | 'MISSING_INTERNAL'
  | 'MISSING_EXTERNAL'
  | 'RESOLVED';

export interface ExternalGatewayTransaction {
  gatewayTxId: string;
  internalReferenceId: string;
  amount: number;
  currency: string;
  status: string;
}

export interface ReconciliationRecord {
  id: string;
  provider: string;
  externalTransactionId: string;
  internalTransactionId: string;
  externalAmount: number;
  internalAmount: number;
  currency: string;
  status: ReconciliationStatus;
  difference: number;
  notes?: string | null;
  checkedAt: Date;
}

@Injectable()
export class ReconciliationService {
  private readonly logger = new Logger(ReconciliationService.name);
  private records: ReconciliationRecord[] = [
    {
      id: 'rec-seed-001',
      provider: 'RAZORPAY',
      externalTransactionId: 'pay_rzp_994821',
      internalTransactionId: 'ftx-seed-001',
      externalAmount: 4000,
      internalAmount: 4000,
      currency: 'INR',
      status: 'MATCHED',
      difference: 0,
      notes: 'Fully matched with internal ledger',
      checkedAt: new Date(),
    },
  ];

  constructor(private readonly ledgerService: LedgerService) {}

  async runReconciliation(
    provider: string,
    externalTransactions: ExternalGatewayTransaction[]
  ) {
    const internalList = await this.ledgerService.getTransactions({ limit: 1000 });
    const results: ReconciliationRecord[] = [];

    for (const ext of externalTransactions) {
      const internalTx = internalList.find(
        (t) =>
          t.id === ext.internalReferenceId ||
          t.referenceId === ext.internalReferenceId ||
          t.idempotencyKey === ext.gatewayTxId
      );

      let status: ReconciliationStatus = 'MATCHED';
      let diff = 0;
      let notes = 'Transactions match perfectly';

      if (!internalTx) {
        status = 'MISSING_INTERNAL';
        notes = `External TX ${ext.gatewayTxId} missing in internal ledger`;
      } else {
        diff = Math.round((ext.amount - internalTx.amount) * 100) / 100;
        if (Math.abs(diff) > 0.01) {
          status = 'MISMATCHED';
          notes = `Amount mismatch: Ext ₹${ext.amount} vs Int ₹${internalTx.amount}`;
        }
      }

      const rec: ReconciliationRecord = {
        id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        provider,
        externalTransactionId: ext.gatewayTxId,
        internalTransactionId: internalTx?.id || ext.internalReferenceId,
        externalAmount: ext.amount,
        internalAmount: internalTx?.amount || 0.0,
        currency: ext.currency || 'INR',
        status,
        difference: diff,
        notes,
        checkedAt: new Date(),
      };
      this.records.unshift(rec);
      results.push(rec);
    }

    return {
      totalAudited: externalTransactions.length,
      matched: results.filter((r) => r.status === 'MATCHED').length,
      mismatched: results.filter((r) => r.status === 'MISMATCHED').length,
      missingInternal: results.filter((r) => r.status === 'MISSING_INTERNAL').length,
      records: results,
    };
  }

  async getReconciliationRecords(status?: ReconciliationStatus): Promise<ReconciliationRecord[]> {
    if (status) return this.records.filter((r) => r.status === status);
    return this.records;
  }

  async resolveMismatch(id: string, notes: string): Promise<ReconciliationRecord> {
    const rec = this.records.find((r) => r.id === id);
    if (rec) {
      rec.status = 'RESOLVED';
      rec.notes = `RESOLVED: ${notes}`;
      return rec;
    }
    throw new Error('Reconciliation record not found');
  }
}

