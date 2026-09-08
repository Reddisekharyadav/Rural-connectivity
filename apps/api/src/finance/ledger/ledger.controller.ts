import { Controller, Get, Query } from '@nestjs/common';
import { LedgerService, LedgerAccountType } from './ledger.service';

@Controller('finance/ledger')
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Get('entries')
  async getEntries(
    @Query('accountId') accountId?: string,
    @Query('accountType') accountType?: LedgerAccountType,
    @Query('limit') limit?: string
  ) {
    return this.ledgerService.getLedgerEntries({
      accountId,
      accountType,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('verify-integrity')
  async verifyIntegrity() {
    return this.ledgerService.verifyIntegrity();
  }
}
