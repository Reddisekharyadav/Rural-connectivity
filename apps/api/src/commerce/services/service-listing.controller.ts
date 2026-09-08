import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ServiceListingService, ServicePricingModel } from './service-listing.service';

@Controller('service-listings')
export class ServiceListingController {
  constructor(private readonly listingService: ServiceListingService) {}

  @Post()
  async createListing(
    @Body()
    body: {
      businessId: string;
      categoryId: string;
      title: string;
      description?: string;
      pricingModel?: ServicePricingModel;
      basePrice?: number;
      hourlyRate?: number;
      inspectionFee?: number;
      serviceRadiusKm?: number;
      locationId?: string;
      requiresAppointment?: boolean;
    },
  ) {
    return this.listingService.createListing(body);
  }

  @Get()
  async listListings(
    @Query('categoryId') categoryId?: string,
    @Query('businessId') businessId?: string,
    @Query('search') search?: string,
  ) {
    return this.listingService.listListings({ categoryId, businessId, search });
  }

  @Get(':id')
  async getListingById(@Param('id') id: string) {
    return this.listingService.getListingById(id);
  }

  @Post(':id/book')
  async bookAsWorkRequest(
    @Param('id') id: string,
    @Body()
    body: {
      customerId: string;
      locationId: string;
      description: string;
      preferredDate?: string;
    },
  ) {
    return this.listingService.bridgeToWorkRequest(id, body);
  }
}

