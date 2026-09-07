import { Injectable } from '@nestjs/common';
import { AssetCondition } from '../assets/asset.service';

export interface AssetRankingInput {
  asset: {
    id: string;
    condition?: AssetCondition;
    rating?: number;
    ownerRating?: number;
    ownerVerificationTier?: number;
  };
  distanceKm: number;
  maxDistanceKm: number;
  requestedPrice?: number;
  listingPrice?: number;
}

export interface AssetScoreBreakdown {
  proximityScore: number;       // Max 25
  ratingScore: number;          // Max 25
  conditionScore: number;       // Max 20
  priceCompetitiveness: number; // Max 15
  ownerVerification: number;    // Max 15
  totalScore: number;           // Max 100
}

@Injectable()
export class AssetRankingService {
  calculateScore(input: AssetRankingInput): { score: number; breakdown: AssetScoreBreakdown } {
    // 1. Proximity Score (25 pts max)
    const proximityScore = Math.max(0, 25 - (input.distanceKm / (input.maxDistanceKm || 25)) * 25);

    // 2. Rating Score (25 pts max)
    const ownerRating = input.asset.ownerRating || input.asset.rating || 4.5;
    const ratingScore = (ownerRating / 5.0) * 25;

    // 3. Asset Condition (20 pts max)
    let conditionScore = 15;
    if (input.asset.condition === 'EXCELLENT') conditionScore = 20;
    else if (input.asset.condition === 'GOOD') conditionScore = 16;
    else if (input.asset.condition === 'FAIR') conditionScore = 10;
    else if (input.asset.condition === 'POOR') conditionScore = 5;

    // 4. Price Competitiveness (15 pts max)
    let priceCompetitiveness = 12;
    if (input.requestedPrice && input.listingPrice) {
      if (input.listingPrice <= input.requestedPrice) priceCompetitiveness = 15;
      else if (input.listingPrice <= input.requestedPrice * 1.15) priceCompetitiveness = 10;
      else priceCompetitiveness = 5;
    }

    // 5. Owner Verification Tier (15 pts max)
    const tier = input.asset.ownerVerificationTier ?? 2;
    const ownerVerification = Math.min(15, (tier / 4.0) * 15);

    const totalScore = Math.round(
      (proximityScore + ratingScore + conditionScore + priceCompetitiveness + ownerVerification) * 10
    ) / 10;

    return {
      score: totalScore,
      breakdown: {
        proximityScore: Math.round(proximityScore * 10) / 10,
        ratingScore: Math.round(ratingScore * 10) / 10,
        conditionScore,
        priceCompetitiveness,
        ownerVerification: Math.round(ownerVerification * 10) / 10,
        totalScore,
      },
    };
  }
}

