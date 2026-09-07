import { Injectable } from '@nestjs/common';
import { AssetService, AssetType } from '../assets/asset.service';
import { RentalListingService, RentalMode } from '../listings/listing.service';
import { AssetRankingService, AssetScoreBreakdown } from './asset-ranking.service';

export interface AssetSearchCriteria {
  assetType?: AssetType;
  latitude?: number;
  longitude?: number;
  maxDistanceKm?: number;
  minCapacity?: number;
  rentalMode?: RentalMode;
  maxDailyPrice?: number;
  requiresOperator?: boolean;
}

export interface MatchedAssetResult {
  assetId: string;
  listingId?: string;
  name: string;
  assetType: AssetType;
  brand: string;
  model: string;
  capacity?: number;
  capacityUnit?: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerRating: number;
  distanceKm: number;
  dailyRate?: number;
  hourlyRate?: number;
  rentalMode?: RentalMode;
  requiresOperator?: boolean;
  score: number;
  breakdown: AssetScoreBreakdown;
  attachments: string[];
}

@Injectable()
export class AssetMatchingService {
  constructor(
    private readonly assetService: AssetService,
    private readonly listingService: RentalListingService,
    private readonly rankingService: AssetRankingService,
  ) {}

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in KM
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  }

  async searchAssets(criteria: AssetSearchCriteria): Promise<MatchedAssetResult[]> {
    const assets = await this.assetService.listAssets({
      assetType: criteria.assetType,
      status: 'ACTIVE',
    });

    const listings = await this.listingService.listListings({ status: 'ACTIVE' });
    const maxDist = criteria.maxDistanceKm || 25;
    const results: MatchedAssetResult[] = [];

    for (const asset of assets) {
      if (criteria.minCapacity && asset.capacity && asset.capacity < criteria.minCapacity) {
        continue;
      }

      let distanceKm = 3.5;
      if (criteria.latitude && criteria.longitude && asset.latitude && asset.longitude) {
        distanceKm = this.calculateDistance(
          criteria.latitude,
          criteria.longitude,
          asset.latitude,
          asset.longitude
        );
      }

      if (distanceKm > maxDist) continue;

      const matchingListing = listings.find((l) => l.assetId === asset.id);
      const dailyPrice = matchingListing?.price || asset.dailyRate || 3500;

      if (criteria.maxDailyPrice && dailyPrice > criteria.maxDailyPrice) continue;
      if (criteria.rentalMode && matchingListing && matchingListing.rentalMode !== criteria.rentalMode) {
        continue;
      }

      const { score, breakdown } = this.rankingService.calculateScore({
        asset: {
          id: asset.id,
          condition: asset.condition,
          rating: asset.rating,
          ownerRating: asset.ownerRating,
          ownerVerificationTier: asset.ownerVerificationTier,
        },
        distanceKm,
        maxDistanceKm: maxDist,
        requestedPrice: criteria.maxDailyPrice,
        listingPrice: dailyPrice,
      });

      results.push({
        assetId: asset.id,
        listingId: matchingListing?.id,
        name: asset.name,
        assetType: asset.assetType,
        brand: asset.brand,
        model: asset.model,
        capacity: asset.capacity,
        capacityUnit: asset.capacityUnit,
        ownerId: asset.ownerId,
        ownerName: asset.ownerName,
        ownerPhone: asset.ownerPhone,
        ownerRating: asset.ownerRating || asset.rating || 4.8,
        distanceKm,
        dailyRate: dailyPrice,
        hourlyRate: asset.hourlyRate,
        rentalMode: matchingListing?.rentalMode || 'EQUIPMENT_ONLY',
        requiresOperator: matchingListing?.requiresOperator || false,
        score,
        breakdown,
        attachments: (asset.attachments || []).map((a: any) => a.attachmentType),
      });
    }

    return results.sort((a, b) => b.score - a.score);
  }
}

