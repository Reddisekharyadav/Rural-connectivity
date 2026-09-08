import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { SettlementService } from './settlement.service';

@Controller('finance/settlements')
export class SettlementController {
  constructor(private readonly settlementService: SettlementService) {}

  @Get()
  async getSettlements(@Query('providerId') providerId?: string) {
    return this.settlementService.getSettlements(providerId);
  }

  @Post(':id/eligible')
  async markEligible(@Param('id') id: string) {
    return this.settlementService.markEligibleForSettlement(id);
  }

  @Post('admin/:id/process')
  async processSettlement(
    @Param('id') id: string,
    @Body() body: { bankReference?: string }
  ) {
    return this.settlementService.processSettlement(id, body?.bankReference);
  }

  @Post('admin/:id/hold')
  async holdSettlement(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.settlementService.putOnHold(id, body.reason);
  }
}
