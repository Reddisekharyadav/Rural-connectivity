import { Module } from '@nestjs/common';

// Businesses
import { BusinessService } from './businesses/business.service';
import { BusinessController } from './businesses/business.controller';

// Locations
import { BusinessLocationService } from './locations/business-location.service';
import { BusinessLocationController } from './locations/business-location.controller';

// Products
import { CommerceProductService } from './products/commerce-product.service';
import { CommerceProductController } from './products/commerce-product.controller';

// Business Products
import { BusinessProductService } from './business-products/business-product.service';
import { BusinessProductController } from './business-products/business-product.controller';

// Compatibility
import { CompatibilityService } from './compatibility/compatibility.service';
import { CompatibilityController } from './compatibility/compatibility.controller';

// Inventory
import { InventoryService } from './inventory/inventory.service';
import { InventoryController } from './inventory/inventory.controller';

// Categories
import { ServiceCategoryService } from './categories/service-category.service';
import { ServiceCategoryController } from './categories/service-category.controller';

// Services
import { ServiceListingService } from './services/service-listing.service';
import { ServiceListingController } from './services/service-listing.controller';

// Search & Ranking
import { RankingService } from './search/ranking.service';
import { CommerceSearchService } from './search/commerce-search.service';
import { CommerceSearchController } from './search/commerce-search.controller';

// Enquiries
import { EnquiryService } from './enquiries/enquiry.service';
import { EnquiryController } from './enquiries/enquiry.controller';

// Quotes
import { QuoteService } from './quotes/quote.service';
import { QuoteController } from './quotes/quote.controller';

// Orders
import { OrderService } from './orders/order.service';
import { OrderController } from './orders/order.controller';

// Fulfillment
import { FulfillmentService } from './fulfillment/fulfillment.service';
import { FulfillmentController } from './fulfillment/fulfillment.controller';

// Analytics
import { CommerceAnalyticsService } from './analytics/commerce-analytics.service';
import { CommerceAnalyticsController } from './analytics/commerce-analytics.controller';

@Module({
  imports: [],
  controllers: [
    BusinessController,
    BusinessLocationController,
    CommerceProductController,
    BusinessProductController,
    CompatibilityController,
    InventoryController,
    ServiceCategoryController,
    ServiceListingController,
    CommerceSearchController,
    EnquiryController,
    QuoteController,
    OrderController,
    FulfillmentController,
    CommerceAnalyticsController,
  ],
  providers: [
    BusinessService,
    BusinessLocationService,
    CommerceProductService,
    BusinessProductService,
    CompatibilityService,
    InventoryService,
    ServiceCategoryService,
    ServiceListingService,
    RankingService,
    CommerceSearchService,
    EnquiryService,
    QuoteService,
    OrderService,
    FulfillmentService,
    CommerceAnalyticsService,
  ],
  exports: [
    BusinessService,
    BusinessLocationService,
    CommerceProductService,
    BusinessProductService,
    CompatibilityService,
    InventoryService,
    ServiceCategoryService,
    ServiceListingService,
    RankingService,
    CommerceSearchService,
    EnquiryService,
    QuoteService,
    OrderService,
    FulfillmentService,
    CommerceAnalyticsService,
  ],
})
export class CommerceModule {}

