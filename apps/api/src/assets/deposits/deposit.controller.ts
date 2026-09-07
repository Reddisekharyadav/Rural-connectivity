import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RentalDepositService, ResolveDepositDto } from './deposit.service';

@Controller('rental-deposits')
export class RentalDepositController {
  constructor(private readonly depositService: RentalDepositService) {}

  @Get('booking/:bookingId')
  async getDepositByBookingId(@Param('bookingId') bookingId: string) {
    return this.depositService.getDepositByBookingId(bookingId);
  }

  @Post('booking/:bookingId/refund')
  async refundDeposit(@Param('bookingId') bookingId: string, @Body('reason') reason?: string) {
    return this.depositService.refundDeposit(bookingId, reason);
  }

  @Post('booking/:bookingId/resolve-damage')
  async resolveDamageAdjustment(
    @Param('bookingId') bookingId: string,
    @Body() dto: ResolveDepositDto,
  ) {
    return this.depositService.resolveDamageAdjustment(bookingId, dto);
  }
}

