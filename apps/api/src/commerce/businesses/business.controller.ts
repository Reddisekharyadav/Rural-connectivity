import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { BusinessService, BusinessType, VerificationStatus } from './business.service';

@Controller('businesses')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  async createBusiness(
    @Body()
    body: {
      ownerId: string;
      organizationId?: string;
      businessName: string;
      businessType?: BusinessType;
      description?: string;
      phone: string;
      email?: string;
      locationId: string;
      village?: string;
      lat?: number;
      lng?: number;
      serviceRadiusKm?: number;
    },
  ) {
    return this.businessService.createBusiness(body);
  }

  @Get()
  async listBusinesses(
    @Query('businessType') businessType?: BusinessType,
    @Query('status') status?: string,
    @Query('locationId') locationId?: string,
  ) {
    return this.businessService.listBusinesses({ businessType, status, locationId });
  }

  @Get(':id')
  async getBusinessById(@Param('id') id: string) {
    return this.businessService.getBusinessById(id);
  }

  @Patch(':id/verification')
  async updateVerification(
    @Param('id') id: string,
    @Body('verificationStatus') verificationStatus: VerificationStatus,
  ) {
    return this.businessService.updateVerification(id, verificationStatus);
  }
}
