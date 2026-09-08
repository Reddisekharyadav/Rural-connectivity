import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { PayoutDestinationService, PayoutDestinationType } from './payout-destination.service';

@Controller('finance/payout-destinations')
export class PayoutDestinationController {
  constructor(private readonly payoutService: PayoutDestinationService) {}

  @Get()
  async getDestinations(@Query('userId') userId = 'user-kiran-001') {
    return this.payoutService.getDestinations(userId);
  }

  @Post()
  async createDestination(
    @Body()
    body: {
      userId: string;
      type: PayoutDestinationType;
      accountHolderName: string;
      identifier: string;
      provider?: string;
    }
  ) {
    return this.payoutService.createDestination(body);
  }

  @Delete(':id')
  async deleteDestination(@Param('id') id: string, @Query('userId') userId = 'user-kiran-001') {
    return this.payoutService.deleteDestination(id, userId);
  }
}
