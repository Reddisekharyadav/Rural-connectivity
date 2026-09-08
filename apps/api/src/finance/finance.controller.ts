import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { LedgerService } from './ledger/ledger.service';
import { SettlementService } from './settlements/settlement.service';
import { WalletService } from './wallets/wallet.service';
import { FinancialTransactionService } from './transactions/financial-transaction.service';

@Controller('finance')
export class FinanceController {
  constructor(
    private readonly ledgerService: LedgerService,
    private readonly settlementService: SettlementService,
    private readonly walletService: WalletService,
    private readonly txService: FinancialTransactionService
  ) {}

  @Get('ledger/transactions')
  async getTransactions(@Query('userId') userId?: string) {
    return this.txService.getTransactions({ userId });
  }

  @Get('ledger/entries')
  async getLedgerEntries(@Query('accountId') accountId?: string) {
    return this.ledgerService.getLedgerEntries({ accountId });
  }

  @Get('earnings/me')
  async getMyEarnings(@Query('providerId') providerId = 'to-suresh-002') {
    const wallet = await this.walletService.getOrCreateWallet(providerId);
    return {
      providerId,
      availableBalance: wallet.balance?.availableBalance || 0,
      pendingBalance: wallet.balance?.pendingBalance || 0,
      heldBalance: wallet.balance?.heldBalance || 0,
    };
  }

  @Get('settlements')
  async getSettlements(@Query('providerId') providerId?: string) {
    return this.settlementService.getSettlements(providerId);
  }

  @Post('settlements/:bookingId/eligible')
  async markSettlementEligible(@Param('bookingId') bookingId: string) {
    return this.settlementService.markEligibleForSettlement(bookingId);
  }

  @Post('admin/settlements/:id/process')
  async processSettlement(
    @Param('id') id: string,
    @Body() body: { bankReference?: string }
  ) {
    return this.settlementService.processSettlement(id, body?.bankReference);
  }

  @Post('admin/settlements/:id/hold')
  async holdSettlement(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.settlementService.putOnHold(id, body.reason);
  }
}
