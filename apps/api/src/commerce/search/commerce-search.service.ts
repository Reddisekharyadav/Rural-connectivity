import { Injectable } from '@nestjs/common';
import { BusinessService } from '../businesses/business.service';
import { BusinessProductService } from '../business-products/business-product.service';
import { ServiceListingService } from '../services/service-listing.service';
import { RankingService, RankedItem } from './ranking.service';

@Injectable()
export class CommerceSearchService {
  constructor(
    private readonly businessService: BusinessService,
    private readonly businessProductService: BusinessProductService,
    private readonly serviceListingService: ServiceListingService,
    private readonly rankingService: RankingService,
  ) {}

  async searchCommerce(query: {
    keyword?: string;
    category?: string;
    lat?: number;
    lng?: number;
    maxDistanceKm?: number;
    brand?: string;
    model?: string;
  }): Promise<{
    results: RankedItem[];
    total: number;
    querySummary: string;
  }> {
    const userLat = query.lat || 17.2543;
    const userLng = query.lng || 77.5821;
    const searchStr = query.keyword?.toLowerCase() || '';

    const businessProducts = await this.businessProductService.listAllActive();
    const serviceListings = await this.serviceListingService.listListings();
    const businesses = await this.businessService.listBusinesses({ status: 'ACTIVE' });

    const itemsToRank: any[] = [];

    // Map Products
    for (const bp of businessProducts) {
      const p = bp.product;
      const matchesSearch =
        !searchStr ||
        p?.name.toLowerCase().includes(searchStr) ||
        p?.brand?.toLowerCase().includes(searchStr) ||
        p?.model?.toLowerCase().includes(searchStr) ||
        p?.category.toLowerCase().includes(searchStr);

      if (matchesSearch) {
        let biz;
        try {
          biz = await this.businessService.getBusinessById(bp.businessId);
        } catch {}

        itemsToRank.push({
          id: bp.id,
          type: 'PRODUCT' as const,
          title: p?.name || 'Agri Spare Part',
          businessName: biz?.businessName || 'Rural Business',
          lat: biz?.lat || userLat,
          lng: biz?.lng || userLng,
          rating: biz?.rating || 4.8,
          verificationTier: biz?.verificationStatus === 'GOLD' ? 4 : biz?.verificationStatus === 'VERIFIED' ? 3 : 1,
          price: bp.price,
          availableStock: bp.stockQuantity - bp.reservedQuantity,
          serviceRadiusKm: biz?.serviceRadiusKm || 25.0,
          data: {
            businessProduct: bp,
            product: p,
            business: biz,
          },
        });
      }
    }

    // Map Services
    for (const svc of serviceListings) {
      const matchesSearch =
        !searchStr ||
        svc.title.toLowerCase().includes(searchStr) ||
        svc.description?.toLowerCase().includes(searchStr) ||
        svc.category?.name.toLowerCase().includes(searchStr);

      if (matchesSearch) {
        let biz;
        try {
          biz = await this.businessService.getBusinessById(svc.businessId);
        } catch {}

        itemsToRank.push({
          id: svc.id,
          type: 'SERVICE' as const,
          title: svc.title,
          businessName: biz?.businessName || 'Service Provider',
          lat: biz?.lat || userLat,
          lng: biz?.lng || userLng,
          rating: biz?.rating || 4.9,
          verificationTier: biz?.verificationStatus === 'GOLD' ? 4 : biz?.verificationStatus === 'VERIFIED' ? 3 : 1,
          price: svc.basePrice || svc.hourlyRate || svc.inspectionFee || 0,
          availableStock: 1,
          serviceRadiusKm: svc.serviceRadiusKm,
          data: {
            serviceListing: svc,
            business: biz,
          },
        });
      }
    }

    const ranked = this.rankingService.rankItems(itemsToRank, { lat: userLat, lng: userLng });

    const filtered = query.maxDistanceKm
      ? ranked.filter((r) => r.distanceKm <= query.maxDistanceKm!)
      : ranked;

    return {
      results: filtered,
      total: filtered.length,
      querySummary: searchStr ? `Results matching '${searchStr}' near (${userLat}, ${userLng})` : 'All nearby commerce offerings',
    };
  }
}

