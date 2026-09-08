export interface PaymentCreatedV1 {
  transactionId: string;
  payerId: string;
  payeeId?: string;
  amount: number;
  currency: string;
  paymentMethod: 'UPI' | 'BANK_TRANSFER' | 'WALLET' | 'CASH' | 'CARD';
  category: 'SERVICES' | 'RENTALS' | 'JOBS' | 'COMMERCE' | 'PRODUCE' | 'LOGISTICS';
  referenceType: string;
  referenceId: string;
  createdAt: string;
}

export interface PaymentSucceededV1 {
  transactionId: string;
  gatewayTransactionId?: string;
  amount: number;
  completedAt: string;
}

export interface PaymentFailedV1 {
  transactionId: string;
  failureReason: string;
  failedAt: string;
}

