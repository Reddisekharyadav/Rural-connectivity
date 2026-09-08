import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { WalletHoldService, WalletHoldStatus } from './wallet-hold.service';

@Controller('finance/holds')
export class WalletHoldController {
  constructor(private readonly holdService: WalletHoldService) {}

  @Get()
  async getHolds(
    @Query('walletAccountId') walletAccountId: string,
    @Query('status') status?: WalletHoldStatus
  ) {
    return this.holdService.getHolds(walletAccountId || 'wallet-kiran-001', status);
  }

  @Post(':id/release')
  async releaseHold(@Param('id') id: string) {
    return this.holdService.releaseHold(id);
  }

  @Post(':id/capture')
  async captureHold(@Param('id') id: string) {
    return this.holdService.captureHold(id);
  }
}

