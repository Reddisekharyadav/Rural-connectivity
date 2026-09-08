import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiKeyGuard } from '../../authentication/api-keys/api-key.guard';
import { ScopesGuard, RequireScopes } from '../../authorization/scopes/scopes.guard';
import { RateLimiterGuard } from '../../rate-limits/rate-limiter.guard';
import { ApiScope } from '../../authorization/scopes/api-scopes';
import {
  ExternalFarmDto,
  ExternalJobDto,
  ExternalAssetDto,
  ExternalOrderDto,
  ExternalProduceDto,
  ExternalTransportDto,
  ExternalAnalyticsDto,
} from '../dto/platform.dto';

@Controller('v1')
export class PlatformV1Controller {
  private farms: ExternalFarmDto[] = [
    {
      id: 'farm-001',
      name: 'Mallesh Cotton Field - Tangipalli',
      totalAcres: 5.0,
      soilType: 'BLACK_COTTON',
      primaryCrop: 'Cotton',
      location: { village: 'Tangipalli', mandal: 'Tandur', district: 'Vikarabad' },
    },
    {
      id: 'farm-002',
      name: 'Suresh Rao Paddy Wetland',
      totalAcres: 8.5,
      soilType: 'ALLUVIAL_LOAM',
      primaryCrop: 'Paddy',
      location: { village: 'Basheerabad', mandal: 'Tandur', district: 'Vikarabad' },
    },
  ];

  private jobs: ExternalJobDto[] = [
    {
      id: 'job-001',
      title: 'Bulk Cotton Sowing & Intercultural Weeding Operation',
      skillCategory: 'COTTON_SOWING',
      requiredWorkers: 6,
      dailyWage: 650.0,
      startDate: new Date().toISOString(),
      status: 'IN_PROGRESS',
      location: { village: 'Tangipalli', mandal: 'Tandur', district: 'Vikarabad' },
    },
  ];

  private assets: ExternalAssetDto[] = [
    {
      id: 'ast-001',
      code: 'AST-JD-5050D-01',
      name: 'John Deere 5050D PowerPro (50 HP)',
      category: 'TRACTOR',
      modelNumber: '5050D',
      condition: 'EXCELLENT',
      status: 'AVAILABLE',
      location: { village: 'Tangipalli', mandal: 'Tandur', district: 'Vikarabad' },
    },
  ];

  private orders: ExternalOrderDto[] = [
    {
      id: 'ord-001',
      orderNumber: 'ORD-2026-00921',
      totalAmount: 4800.0,
      currency: 'INR',
      status: 'COMPLETED',
      fulfillmentMethod: 'LOCAL_DELIVERY',
      itemCount: 2,
      createdAt: new Date().toISOString(),
    },
  ];

  private produceListings: ExternalProduceDto[] = [
    {
      id: 'prd-001',
      code: 'PRD-2026-0089',
      cropName: 'Cotton',
      variety: 'Brahma 32mm',
      quantity: 120.0,
      unit: 'Quintals',
      qualityGrade: 'Grade A',
      askingPrice: 7200.0,
      status: 'AVAILABLE',
      location: { village: 'Tangipalli', mandal: 'Tandur', district: 'Vikarabad' },
    },
  ];

  private transportListings: ExternalTransportDto[] = [
    {
      id: 'trq-001',
      code: 'TRQ-COM-00842',
      cargoType: 'Agricultural Inputs & Spare Parts',
      weightTons: 1.5,
      status: 'DELIVERED',
      distanceKm: 12.0,
      pickupDate: new Date().toISOString(),
    },
  ];

  @Get('health')
  async getHealth() {
    return {
      status: 'HEALTHY',
      platformVersion: 'v1.0.0',
      timestamp: new Date().toISOString(),
    };
  }

  // 1. Farms API
  @Get('farms')
  @UseGuards(ApiKeyGuard, ScopesGuard, RateLimiterGuard)
  @RequireScopes(ApiScope.FARMS_READ)
  async listFarms(
    @Query('mandal') mandal?: string,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ) {
    let data = [...this.farms];
    if (mandal) {
      data = data.filter((f) => f.location.mandal.toLowerCase() === mandal.toLowerCase());
    }
    const paginated = data.slice(Number(offset), Number(offset) + Number(limit));

    return {
      success: true,
      version: 'v1',
      data: paginated,
      meta: { totalCount: data.length, page: Math.floor(offset / limit) + 1 },
    };
  }

  // 2. Jobs API
  @Get('jobs')
  @UseGuards(ApiKeyGuard, ScopesGuard, RateLimiterGuard)
  @RequireScopes(ApiScope.JOBS_READ)
  async listJobs(
    @Query('skillCategory') skillCategory?: string,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ) {
    let data = [...this.jobs];
    if (skillCategory) {
      data = data.filter((j) => j.skillCategory === skillCategory);
    }
    return { success: true, version: 'v1', data };
  }

  // 3. Assets API
  @Get('assets')
  @UseGuards(ApiKeyGuard, ScopesGuard, RateLimiterGuard)
  @RequireScopes(ApiScope.ASSETS_READ)
  async listAssets(
    @Query('category') category?: string,
    @Query('limit') limit: number = 20,
  ) {
    let data = [...this.assets];
    if (category) {
      data = data.filter((a) => a.category === category);
    }
    return { success: true, version: 'v1', data };
  }

  // 4. Orders API
  @Get('orders')
  @UseGuards(ApiKeyGuard, ScopesGuard, RateLimiterGuard)
  @RequireScopes(ApiScope.ORDERS_READ)
  async listOrders(@Query('limit') limit: number = 20) {
    return { success: true, version: 'v1', data: this.orders };
  }

  // 5. Produce API
  @Get('produce')
  @UseGuards(ApiKeyGuard, ScopesGuard, RateLimiterGuard)
  @RequireScopes(ApiScope.PRODUCE_READ)
  async listProduce(
    @Query('cropName') cropName?: string,
    @Query('limit') limit: number = 20,
  ) {
    let data = [...this.produceListings];
    if (cropName) {
      data = data.filter((p) => p.cropName.toLowerCase().includes(cropName.toLowerCase()));
    }
    return { success: true, version: 'v1', data };
  }

  // 6. Transport API
  @Get('transport')
  @UseGuards(ApiKeyGuard, ScopesGuard, RateLimiterGuard)
  @RequireScopes(ApiScope.TRANSPORT_READ)
  async listTransport(@Query('limit') limit: number = 20) {
    return { success: true, version: 'v1', data: this.transportListings };
  }

  // 7. Platform Analytics API
  @Get('analytics')
  @UseGuards(ApiKeyGuard, ScopesGuard, RateLimiterGuard)
  @RequireScopes(ApiScope.ANALYTICS_READ)
  async getAnalyticsSummary(@Query('mandal') mandal: string = 'Tandur') {
    const data: ExternalAnalyticsDto = {
      mandal,
      activeFarms: 1420,
      activeJobs: 84,
      activeMachinery: 112,
      totalTransactionVolumeInr: 4850000.0,
      generatedAt: new Date().toISOString(),
    };

    return { success: true, version: 'v1', data };
  }
}
