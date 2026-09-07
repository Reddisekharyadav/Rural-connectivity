import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AssetHandoverService, RecordHandoverDto } from './handover.service';

@Controller('asset-handovers')
export class AssetHandoverController {
  constructor(private readonly handoverService: AssetHandoverService) {}

  @Post()
  async recordHandover(@Body() dto: RecordHandoverDto) {
    return this.handoverService.recordHandover(dto);
  }

  @Get('booking/:bookingId')
  async getHandoversForBooking(@Param('bookingId') bookingId: string) {
    return this.handoverService.getHandoversForBooking(bookingId);
  }
}

