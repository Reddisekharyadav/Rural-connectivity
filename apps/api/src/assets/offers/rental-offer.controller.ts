import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateRentalOfferDto, RentalOfferService } from './rental-offer.service';

@Controller()
export class RentalOfferController {
  constructor(private readonly offerService: RentalOfferService) {}

  @Post('rental-requests/:id/offers')
  async createOffer(@Param('id') rentalRequestId: string, @Body() body: Omit<CreateRentalOfferDto, 'rentalRequestId'>) {
    return this.offerService.createOffer({ ...body, rentalRequestId });
  }

  @Get('rental-requests/:id/offers')
  async listOffersForRequest(@Param('id') rentalRequestId: string) {
    return this.offerService.listOffersForRequest(rentalRequestId);
  }

  @Get('rental-offers/:id')
  async getOfferById(@Param('id') id: string) {
    return this.offerService.getOfferById(id);
  }

  @Post('rental-offers/:id/reject')
  async rejectOffer(@Param('id') id: string) {
    return this.offerService.rejectOffer(id);
  }

  @Post('rental-offers/:id/withdraw')
  async withdrawOffer(@Param('id') id: string, @Body('providerId') providerId: string) {
    return this.offerService.withdrawOffer(id, providerId);
  }
}

