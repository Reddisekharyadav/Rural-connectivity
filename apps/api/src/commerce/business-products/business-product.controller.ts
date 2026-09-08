import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { BusinessProductService } from './business-product.service';

@Controller()
export class BusinessProductController {
  constructor(private readonly businessProductService: BusinessProductService) {}

  @Post('businesses/:businessId/products')
  async createBusinessProduct(
    @Param('businessId') businessId: string,
    @Body()
    body: {
      productId: string;
      businessLocationId?: string;
      price: number;
      currency?: string;
      stockQuantity?: number;
      minimumOrderQuantity?: number;
      sku?: string;
    },
  ) {
    return this.businessProductService.createBusinessProduct(businessId, body);
  }

  @Get('businesses/:businessId/products')
  async getBusinessProducts(@Param('businessId') businessId: string) {
    return this.businessProductService.getBusinessProducts(businessId);
  }

  @Get('business-products/:id')
  async getBusinessProductById(@Param('id') id: string) {
    return this.businessProductService.getBusinessProductById(id);
  }

  @Patch('business-products/:id')
  async updatePricingAndStock(
    @Param('id') id: string,
    @Body()
    body: {
      price?: number;
      stockQuantity?: number;
      minimumOrderQuantity?: number;
    },
  ) {
    return this.businessProductService.updatePricingAndStock(id, body);
  }
}

