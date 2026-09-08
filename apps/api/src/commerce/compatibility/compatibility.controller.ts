import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { CompatibilityService, AssetType } from './compatibility.service';

@Controller('products/:productId/compatibility')
export class CompatibilityController {
  constructor(private readonly compatibilityService: CompatibilityService) {}

  @Post()
  async addCompatibility(
    @Param('productId') productId: string,
    @Body()
    body: {
      assetType?: AssetType;
      brand?: string;
      model?: string;
      variant?: string;
      notes?: string;
    },
  ) {
    return this.compatibilityService.addCompatibility(productId, body);
  }

  @Get('check')
  async checkCompatibility(
    @Param('productId') productId: string,
    @Query('assetType') assetType?: AssetType,
    @Query('brand') brand?: string,
    @Query('model') model?: string,
  ) {
    return this.compatibilityService.checkCompatibility(productId, { assetType, brand, model });
  }

  @Get()
  async getCompatibilities(@Param('productId') productId: string) {
    return this.compatibilityService.getCompatibilitiesByProduct(productId);
  }
}

