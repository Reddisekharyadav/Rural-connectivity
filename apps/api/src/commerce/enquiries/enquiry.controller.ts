import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { EnquiryService } from './enquiry.service';

@Controller('commerce-enquiries')
export class EnquiryController {
  constructor(private readonly enquiryService: EnquiryService) {}

  @Post()
  async createEnquiry(
    @Body()
    body: {
      businessId: string;
      buyerId: string;
      buyerName?: string;
      productId?: string;
      productName?: string;
      message: string;
      quantity?: number;
    },
  ) {
    return this.enquiryService.createEnquiry(body);
  }

  @Get('business/:businessId')
  async getByBusiness(@Param('businessId') businessId: string) {
    return this.enquiryService.getEnquiriesByBusiness(businessId);
  }

  @Get('buyer/:buyerId')
  async getByBuyer(@Param('buyerId') buyerId: string) {
    return this.enquiryService.getEnquiriesByBuyer(buyerId);
  }
}

