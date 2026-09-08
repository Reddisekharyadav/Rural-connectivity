import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('finance/wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  async getWallet(@Query('userId') userId = 'user-kiran-001') {
    return this.walletService.getOrCreateWallet(userId);
  }

  @Get('balance')
  async getBalance(@Query('userId') userId = 'user-kiran-001') {
    const wallet = await this.walletService.getOrCreateWallet(userId);
    return wallet.balance;
  }

  @Post(':id/freeze')
  async freezeWallet(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.walletService.freezeWallet(id, body.reason || 'Admin risk hold');
  }

  @Post(':id/unfreeze')
  async unfreezeWallet(@Param('id') id: string) {
    return this.walletService.unfreezeWallet(id);
  }

  @Post('topups')
  async createTopUp(@Body() body: { userId: string; amount: number }) {
    return this.walletService.createTopUp(body.userId, body.amount);
  }

  @Post('topups/:id/confirm')
  async confirmTopUp(@Param('id') id: string, @Body() body: { gatewayTxId?: string }) {
    return this.walletService.confirmTopUp(id, body?.gatewayTxId || 'UPI-REF-001');
  }
}

