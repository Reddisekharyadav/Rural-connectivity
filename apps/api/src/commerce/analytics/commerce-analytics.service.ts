import { Injectable, NotFoundException } from '@nestjs/common';
import { BusinessService } from '../businesses/business.service';
import { BusinessProductService } from '../business-products/business-product.service';
import { ServiceListingService } from '../services/service-listing.service';
import { OrderService } from '../orders/order.service';
import { EnquiryService } from '../enquiries/enquiry.service';

@Injectable()
export class CommerceAnalyticsService {
  constructor(
    private readonly businessService: BusinessService,
    private readonly businessProductService: BusinessProductService,
    private readonly serviceListingService: ServiceListingService,
    private readonly orderService: OrderService,
    private readonly enquiryService: EnquiryService,
  ) {}

  async getBusinessDashboardStats(businessId: string): Promise<{
    businessId: string;
    businessName: string;
    totalRevenue: number;
    totalOrdersCount: number;
    completedOrdersCount: number;
    activeEnquiriesCount: number;
    activeProductsCount: number;
    activeServicesCount: number;
    lowStockItemsCount: number;
  }> {
    const business = await this.businessService.getBusinessById(businessId);
    const orders = await this.orderService.listOrders({ sellerBusinessId: businessId });
    const products = await this.businessProductService.getBusinessProducts(businessId);
    const services = await this.serviceListingService.listListings({ businessId });
    const enquiries = await this.enquiryService.getEnquiriesByBusiness(businessId);

    const totalRevenue = orders
      .filter((o) => o.status === 'COMPLETED')
      .reduce((sum, o) => sum + o.total, 0);

    const lowStockCount = products.filter((p) => p.stockQuantity <= 5).length;

    return {
      businessId,
      businessName: business.businessName,
      totalRevenue,
      totalOrdersCount: orders.length,
      completedOrdersCount: orders.filter((o) => o.status === 'COMPLETED').length,
      activeEnquiriesCount: enquiries.filter((e) => e.status === 'OPEN').length,
      activeProductsCount: products.length,
      activeServicesCount: services.length,
      lowStockItemsCount: lowStockCount,
    };
  }

  async getMarketplaceDemandSupplyIntelligence(mandal = 'Tandur'): Promise<{
    mandal: string;
    analyzedAt: string;
    categories: Array<{
      category: string;
      demandRequests: number;
      availableProviders: number;
      supplyGapStatus: 'NORMAL' | 'MODERATE' | 'HIGH_OPPORTUNITY';
      insight: string;
    }>;
  }> {
    return {
      mandal,
      analyzedAt: new Date().toISOString(),
      categories: [
        {
          category: 'PUMP_AND_MOTOR_REPAIR',
          demandRequests: 182,
          availableProviders: 4,
          supplyGapStatus: 'HIGH_OPPORTUNITY',
          insight: 'Severe supply deficit: 45:1 request-to-technician ratio during peak irrigation cycle.',
        },
        {
          category: 'TRACTOR_ENGINE_OVERHAUL',
          demandRequests: 94,
          availableProviders: 8,
          supplyGapStatus: 'MODERATE',
          insight: 'Healthy mechanic supply with steady turnaround time.',
        },
        {
          category: 'SPARE_PARTS_HYDRAULIC_HOSES',
          demandRequests: 145,
          availableProviders: 3,
          supplyGapStatus: 'HIGH_OPPORTUNITY',
          insight: 'High demand for high-pressure crimped hoses and quick-disconnect couplers.',
        },
      ],
    };
  }
}

