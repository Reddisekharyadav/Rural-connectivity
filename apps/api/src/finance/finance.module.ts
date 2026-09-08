import { Module, Global } from '@nestjs/common';

import { FinancialAuditService } from './audit/financial-audit.service';
import { IdempotencyService } from './idempotency/idempotency.service';
import { LedgerService } from './ledger/ledger.service';
import { LedgerController } from './ledger/ledger.controller';
import { WalletHoldService } from './holds/wallet-hold.service';
import { WalletHoldController } from './holds/wallet-hold.controller';
import { WalletBalanceService } from './wallets/wallet-balance.service';
import { WalletService } from './wallets/wallet.service';
import { WalletController } from './wallets/wallet.controller';
import { FinancialTransactionService } from './transactions/financial-transaction.service';
import { FinancialTransactionController } from './transactions/financial-transaction.controller';
import { PayoutDestinationService } from './payouts/payout-destination.service';
import { PayoutDestinationController } from './payouts/payout-destination.controller';
import { WithdrawalService } from './withdrawals/withdrawal.service';
import { WithdrawalController } from './withdrawals/withdrawal.controller';
import { SettlementService } from './settlements/settlement.service';
import { SettlementController } from './settlements/settlement.controller';
import { ReconciliationService } from './reconciliation/reconciliation.service';
import { ReconciliationController } from './reconciliation/reconciliation.controller';
import { RiskService } from './risk/risk.service';
import { FinanceController } from './finance.controller';

@Global()
@Module({
  controllers: [
    FinanceController,
    WalletController,
    WalletHoldController,
    FinancialTransactionController,
    LedgerController,
    PayoutDestinationController,
    WithdrawalController,
    SettlementController,
    ReconciliationController,
  ],
  providers: [
    FinancialAuditService,
    IdempotencyService,
    LedgerService,
    WalletHoldService,
    WalletBalanceService,
    WalletService,
    FinancialTransactionService,
    PayoutDestinationService,
    WithdrawalService,
    SettlementService,
    ReconciliationService,
    RiskService,
  ],
  exports: [
    FinancialAuditService,
    IdempotencyService,
    LedgerService,
    WalletHoldService,
    WalletBalanceService,
    WalletService,
    FinancialTransactionService,
    PayoutDestinationService,
    WithdrawalService,
    SettlementService,
    ReconciliationService,
    RiskService,
  ],
})
export class FinanceModule {}
