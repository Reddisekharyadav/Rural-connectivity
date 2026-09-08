import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { LedgerService } from '../ledger/ledger.service';
import { FinancialAuditService } from '../audit/financial-audit.service';

export type SettlementStatus =
  | 'PENDING'
  | 'ELIGIBLE'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'ON_HOLD';

export interface SettlementRecord {
  id: string;
  providerId: string;
  referenceType: string;
  referenceId: string;
  amount: number;
  currency: string;
  status: SettlementStatus;
  eligibleAt?: Date | null;
  processedAt?: Date | null;
  payoutReference?: string | null;
  holdReason?: string | null;
  createdAt: Date;
}

@Injectable()
export class SettlementService {
  private settlements: SettlementRecord[] = [
    {
      id: 'stl-sample-001',
      providerId: 'to-suresh-002',
      referenceType: 'SERVICE_BOOKING',
      referenceId: 'TRW-000124',
      amount: 3600,
      currency: 'INR',
      status: 'ELIGIBLE',
      eligibleAt: new Date(),
      processedAt: null,
      payoutReference: null,
      holdReason: null,
      createdAt: new Date(),
    },
    {
      id: 'stl-sample-002',
      providerId: 'wkr-mallesh-001',
      referenceType: 'JOB_ASSIGNMENT',
      referenceId: 'asgn-001',
      amount: 1706.25,
      currency: 'INR',
      status: 'COMPLETED',
      eligibleAt: new Date(),
      processedAt: new Date(),
      payoutReference: 'UTR-WAGE-2026-1102',
      holdReason: null,
      createdAt: new Date(),
    },
  ];

  constructor(
    private readonly ledgerService: LedgerService,
    private readonly auditService: FinancialAuditService
  ) {}

  async createSettlement(params: {
    providerId: string;
    referenceType: string;
    referenceId: string;
    amount: number;
  }): Promise<SettlementRecord> {
    const settlement: SettlementRecord = {
      id: `stl-${Date.now()}`,
      providerId: params.providerId,
      referenceType: params.referenceType,
      referenceId: params.referenceId,
      amount: params.amount,
      currency: 'INR',
      status: 'PENDING',
      eligibleAt: null,
      processedAt: null,
      payoutReference: null,
      holdReason: null,
      createdAt: new Date(),
    };
    this.settlements.push(settlement);
    return settlement;
  }

  async markEligibleForSettlement(referenceId: string): Promise<SettlementRecord> {
    let settlement = this.settlements.find(
      (s) => s.referenceId === referenceId || s.id === referenceId
    );
    if (!settlement) {
      settlement = await this.createSettlement({
        providerId: 'to-suresh-002',
        referenceType: 'SERVICE_BOOKING',
        referenceId,
        amount: 1900,
      });
    }

    if (settlement.status === 'ON_HOLD') {
      return settlement;
    }

    settlement.status = 'ELIGIBLE';
    settlement.eligibleAt = new Date();
    return settlement;
  }

  async processSettlement(id: string, bankReference = 'UTR-SETTLE-2026-9921'): Promise<SettlementRecord> {
    let settlement = this.settlements.find((s) => s.id === id || s.referenceId === id);
    if (!settlement) throw new NotFoundException('Settlement record not found');

    if (settlement.status === 'ON_HOLD') {
      throw new BadRequestException(`Cannot process settlement in ON_HOLD: ${settlement.holdReason}`);
    }

    await this.ledgerService.postDoubleEntry({
      type: 'SETTLEMENT',
      payeeId: settlement.providerId,
      amount: settlement.amount,
      referenceType: settlement.referenceType,
      referenceId: settlement.referenceId,
      category: 'SERVICE_EARNING',
      description: `Milestone settlement release for ${settlement.referenceType} (${settlement.referenceId})`,
      entries: [
        {
          accountType: 'PROVIDER_PAYABLE',
          accountId: settlement.providerId,
          entryType: 'DEBIT',
          amount: settlement.amount,
        },
        {
          accountType: 'WALLET_AVAILABLE',
          accountId: settlement.providerId,
          entryType: 'CREDIT',
          amount: settlement.amount,
        },
      ],
    });

    settlement.status = 'COMPLETED';
    settlement.processedAt = new Date();
    settlement.payoutReference = bankReference;

    await this.auditService.logAction({
      userId: settlement.providerId,
      action: 'SETTLEMENT_PROCESSED',
      resourceType: 'SETTLEMENT',
      resourceId: settlement.id,
      newState: settlement,
    });

    return settlement;
  }

  async putOnHold(id: string, reason: string): Promise<SettlementRecord> {
    let settlement = this.settlements.find((s) => s.id === id || s.referenceId === id);
    if (!settlement) throw new NotFoundException('Settlement record not found');

    settlement.status = 'ON_HOLD';
    settlement.holdReason = reason;
    return settlement;
  }

  async getSettlements(providerId?: string): Promise<SettlementRecord[]> {
    if (providerId) return this.settlements.filter((s) => s.providerId === providerId);
    return this.settlements;
  }
}
