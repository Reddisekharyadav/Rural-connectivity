import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { BusinessLocationService } from './business-location.service';

@Controller('businesses/:businessId/locations')
export class BusinessLocationController {
  constructor(private readonly locationService: BusinessLocationService) {}

  @Post()
  async createLocation(
    @Param('businessId') businessId: string,
    @Body()
    body: {
      name: string;
      locationId: string;
      phone?: string;
      openingTime?: string;
      closingTime?: string;
      isPrimary?: boolean;
    },
  ) {
    return this.locationService.createLocation(businessId, body);
  }

  @Get()
  async getLocations(@Param('businessId') businessId: string) {
    return this.locationService.getLocationsByBusiness(businessId);
  }
}

