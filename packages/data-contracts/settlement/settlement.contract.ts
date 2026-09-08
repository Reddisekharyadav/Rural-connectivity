export interface SettlementCreatedV1 {
  settlementId: string;
  providerId: string;
  grossAmount: number;
  platformFee: number;
  netPayoutAmount: number;
  currency: string;
  category: string;
  status: 'PENDING' | 'PROCESSING' | 'SETTLED' | 'FAILED';
  createdAt: string;
}

export interface SettlementCompletedV1 {
  settlementId: string;
  providerId: string;
  netPayoutAmount: number;
  utrReference?: string;
  settledAt: string;
}
