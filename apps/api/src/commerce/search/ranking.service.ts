import { Injectable } from '@nestjs/common';
import { calculateHaversineDistanceKm } from '../../geo/distance';

export interface RankedItem {
  id: string;
  type: 'PRODUCT' | 'SERVICE' | 'BUSINESS';
  title: string;
  businessName: string;
  distanceKm: number;
  rating: number;
  verificationTier: number;
  price?: number;
  availableStock?: number;
  score: number;
  data: any;
}

@Injectable()
export class RankingService {
  rankItems(
    items: Array<{
      id: string;
      type: 'PRODUCT' | 'SERVICE' | 'BUSINESS';
      title: string;
      businessName: string;
      lat: number;
      lng: number;
      rating: number;
      verificationTier: number;
      price?: number;
      availableStock?: number;
      serviceRadiusKm?: number;
      data: any;
    }>,
    userLocation: { lat: number; lng: number },
  ): RankedItem[] {
    const scored = items.map((item) => {
      let distKm = 2.0;
      try {
        distKm = calculateHaversineDistanceKm(userLocation.lat, userLocation.lng, item.lat, item.lng);
      } catch {
        distKm = 2.0;
      }
      const radius = item.serviceRadiusKm || 25.0;

      // Distance Score (35%)
      const distFactor = Math.max(0.0, 1.0 - distKm / radius);
      const distScore = distFactor * 35.0;

      // Rating Score (25%)
      const ratingScore = Math.min(5.0, Math.max(0, item.rating)) * 5.0; // max 25

      // Verification Tier Score (20%)
      const verifScore = Math.min(4, Math.max(0, item.verificationTier)) * 5.0; // max 20

      // Stock / Availability Score (20%)
      let availScore = 20.0;
      if (item.availableStock !== undefined && item.availableStock <= 0) {
        availScore = 0.0;
      }

      const totalScore = Math.round((distScore + ratingScore + verifScore + availScore) * 10) / 10;

      return {
        id: item.id,
        type: item.type,
        title: item.title,
        businessName: item.businessName,
        distanceKm: Math.round(distKm * 10) / 10,
        rating: item.rating,
        verificationTier: item.verificationTier,
        price: item.price,
        availableStock: item.availableStock,
        score: totalScore,
        data: item.data,
      };
    });

    return scored.sort((a, b) => b.score - a.score);
  }
}

