import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AcceptOfferAndBookDto, DirectRentalBookingDto, RentalBookingService } from './rental-booking.service';
import { RentalBookingStatus } from './booking-state-machine';

@Controller('rental-bookings')
export class RentalBookingController {
  constructor(private readonly bookingService: RentalBookingService) {}

  @Post('from-offer')
  async createFromOffer(@Body() dto: AcceptOfferAndBookDto) {
    return this.bookingService.createFromOffer(dto);
  }

  @Post('direct')
  async createDirectBooking(@Body() dto: DirectRentalBookingDto) {
    return this.bookingService.createDirectBooking(dto);
  }

  @Get()
  async listBookings(
    @Query('ownerId') ownerId?: string,
    @Query('renterId') renterId?: string,
    @Query('assetId') assetId?: string,
    @Query('status') status?: RentalBookingStatus,
  ) {
    return this.bookingService.listBookings({ ownerId, renterId, assetId, status });
  }

  @Get(':id')
  async getBookingById(@Param('id') id: string) {
    return this.bookingService.getBookingById(id);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: RentalBookingStatus) {
    return this.bookingService.updateBookingStatus(id, status);
  }

  @Post(':id/cancel')
  async cancelBooking(@Param('id') id: string) {
    return this.bookingService.updateBookingStatus(id, 'CANCELLED');
  }

  @Post(':id/complete')
  async completeBooking(@Param('id') id: string) {
    return this.bookingService.updateBookingStatus(id, 'COMPLETED');
  }
}

