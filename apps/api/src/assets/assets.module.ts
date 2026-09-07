import { Module } from '@nestjs/common';

// Controllers
import { AssetController } from './assets/asset.controller';
import { AssetSpecificationController } from './specifications/specification.controller';
import { AssetAttachmentController } from './attachments/attachment.controller';
import { RentalListingController } from './listings/listing.controller';
import { RentalRequestController } from './rental-requests/rental-request.controller';
import { RentalOfferController } from './offers/rental-offer.controller';
import { RentalBookingController } from './bookings/rental-booking.controller';
import { AssetHandoverController } from './handover/handover.controller';
import { AssetInspectionController } from './inspections/inspection.controller';
import { AssetMaintenanceController } from './maintenance/maintenance.controller';
import { RentalDepositController } from './deposits/deposit.controller';
import { AssetAnalyticsController } from './analytics/asset-analytics.controller';
import { AssetAccessPolicyController } from './policies/access-policy.controller';

// Services
import { AssetService } from './assets/asset.service';
import { AssetSpecificationService } from './specifications/specification.service';
import { AssetAttachmentService } from './attachments/attachment.service';
import { RentalListingService } from './listings/listing.service';
import { AssetRankingService } from './matching/asset-ranking.service';
import { AssetMatchingService } from './matching/asset-matching.service';
import { RentalRequestService } from './rental-requests/rental-request.service';
import { RentalOfferService } from './offers/rental-offer.service';
import { RentalBookingService } from './bookings/rental-booking.service';
import { AssetHandoverService } from './handover/handover.service';
import { AssetInspectionService } from './inspections/inspection.service';
import { AssetMaintenanceService } from './maintenance/maintenance.service';
import { RentalDepositService } from './deposits/deposit.service';
import { AssetAnalyticsService } from './analytics/asset-analytics.service';
import { AssetAccessPolicyService } from './policies/access-policy.service';

@Module({
  controllers: [
    AssetController,
    AssetSpecificationController,
    AssetAttachmentController,
    RentalListingController,
    RentalRequestController,
    RentalOfferController,
    RentalBookingController,
    AssetHandoverController,
    AssetInspectionController,
    AssetMaintenanceController,
    RentalDepositController,
    AssetAnalyticsController,
    AssetAccessPolicyController,
  ],
  providers: [
    AssetService,
    AssetSpecificationService,
    AssetAttachmentService,
    RentalListingService,
    AssetRankingService,
    AssetMatchingService,
    RentalRequestService,
    RentalOfferService,
    RentalBookingService,
    AssetHandoverService,
    AssetInspectionService,
    AssetMaintenanceService,
    RentalDepositService,
    AssetAnalyticsService,
    AssetAccessPolicyService,
  ],
  exports: [
    AssetService,
    RentalListingService,
    AssetMatchingService,
    RentalBookingService,
    AssetAnalyticsService,
  ],
})
export class AssetsModule {}

