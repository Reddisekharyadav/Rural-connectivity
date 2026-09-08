import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommerceAnalyticsService } from './commerce-analytics.service';

@Controller('commerce/analytics')
export class CommerceAnalyticsController {
  constructor(private readonly analyticsService: CommerceAnalyticsService) {}

  @Get('dashboard/:businessId')
  async getDashboardStats(@Param('businessId') businessId: string) {
    return this.analyticsService.getBusinessDashboardStats(businessId);
  }

  @Get('demand-supply')
  async getDemandSupplyIntelligence(@Query('mandal') mandal?: string) {
    return this.analyticsService.getMarketplaceDemandSupplyIntelligence(mandal || 'Tandur');
  }
}

