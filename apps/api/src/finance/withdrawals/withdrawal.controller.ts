import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { WithdrawalService } from './withdrawal.service';

@Controller('finance/wallet/withdrawals')
export class WithdrawalController {
  constructor(private readonly withdrawalService: WithdrawalService) {}

  @Get()
  async getWithdrawals(@Query('userId') userId?: string) {
    return this.withdrawalService.getWithdrawals(userId);
  }

  @Post()
  async requestWithdrawal(
    @Body() body: { userId: string; amount: number; destinationId: string }
  ) {
    return this.withdrawalService.requestWithdrawal(body);
  }

  @Post(':id/process')
  async processWithdrawal(
    @Param('id') id: string,
    @Body() body: { externalReference?: string }
  ) {
    return this.withdrawalService.processWithdrawal(id, body?.externalReference);
  }

  @Post(':id/cancel')
  async cancelWithdrawal(@Param('id') id: string, @Body() body: { userId: string }) {
    return this.withdrawalService.cancelWithdrawal(id, body.userId);
  }
}

