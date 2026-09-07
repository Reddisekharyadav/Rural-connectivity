import { Controller, Get, Param } from '@nestjs/common';
import { AssetAnalyticsService } from './asset-analytics.service';

@Controller('asset-analytics')
export class AssetAnalyticsController {
  constructor(private readonly analyticsService: AssetAnalyticsService) {}

  @Get('owner/:ownerId/fleet')
  async getOwnerFleetOverview(@Param('ownerId') ownerId: string) {
    return this.analyticsService.getOwnerFleetOverview(ownerId);
  }

  @Get('supply-demand-gap')
  async getRegionalSupplyDemandGap() {
    return this.analyticsService.getRegionalSupplyDemandGap();
  }
}

