import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CommerceProductService } from '../products/commerce-product.service';

export type AssetType =
  | 'TRACTOR'
  | 'SPRAYER'
  | 'PUMP'
  | 'WATER_PUMP'
  | 'TRAILER'
  | 'HARVESTER'
  | 'ROTAVATOR'
  | 'OTHER';

export interface ProductCompatibility {
  id: string;
  productId: string;
  assetType?: AssetType | null;
  brand?: string | null;
  model?: string | null;
  variant?: string | null;
  notes?: string | null;
  createdAt: Date;
}

@Injectable()
export class CompatibilityService {
  private compatibilities = new Map<string, ProductCompatibility[]>([
    [
      'prod-001',
      [
        {
          id: 'cmp-001',
          productId: 'prod-001',
          assetType: 'TRACTOR',
          brand: 'John Deere',
          model: '5310',
          variant: '4WD / 2WD 55HP',
          notes: 'Standard OEM spin-on engine oil filter',
          createdAt: new Date('2026-08-01T10:00:00Z'),
        },
        {
          id: 'cmp-002',
          productId: 'prod-001',
          assetType: 'TRACTOR',
          brand: 'John Deere',
          model: '5050D',
          variant: 'PowerPro 50HP',
          notes: 'Direct fit replacement filter',
          createdAt: new Date('2026-08-01T10:00:00Z'),
        },
      ],
    ],
    [
      'prod-002',
      [
        {
          id: 'cmp-003',
          productId: 'prod-002',
          assetType: 'PUMP',
          brand: 'Kirloskar',
          model: 'KDS-750',
          variant: '7.5 HP Diesel / Electric',
          notes: '3-inch discharge delivery hose with MS nipple clamping',
          createdAt: new Date('2026-08-05T10:00:00Z'),
        },
      ],
    ],
  ]);

  constructor(private readonly productService: CommerceProductService) {}

  async addCompatibility(
    productId: string,
    data: {
      assetType?: AssetType;
      brand?: string;
      model?: string;
      variant?: string;
      notes?: string;
    },
  ): Promise<ProductCompatibility> {
    await this.productService.getProductById(productId);

    if (!data.assetType && !data.brand && !data.model) {
      throw new BadRequestException('At least one compatibility criterion (assetType, brand, model) is required');
    }

    const id = `cmp-${Date.now().toString().slice(-6)}`;
    const comp: ProductCompatibility = {
      id,
      productId,
      assetType: data.assetType || null,
      brand: data.brand || null,
      model: data.model || null,
      variant: data.variant || null,
      notes: data.notes || null,
      createdAt: new Date(),
    };

    const existing = this.compatibilities.get(productId) || [];
    existing.push(comp);
    this.compatibilities.set(productId, existing);
    return comp;
  }

  async checkCompatibility(
    productId: string,
    criteria: {
      assetType?: AssetType;
      brand?: string;
      model?: string;
    },
  ): Promise<{ compatible: boolean; matchDetails: ProductCompatibility | null }> {
    const list = this.compatibilities.get(productId) || [];

    if (list.length === 0) {
      return { compatible: true, matchDetails: null }; // universal spare part
    }

    for (const m of list) {
      const typeMatch = !m.assetType || (criteria.assetType && m.assetType === criteria.assetType);
      const brandMatch = !m.brand || (criteria.brand && m.brand.toLowerCase() === criteria.brand.toLowerCase());
      const modelMatch = !m.model || (criteria.model && m.model.toLowerCase() === criteria.model.toLowerCase());

      if (typeMatch && brandMatch && modelMatch) {
        return { compatible: true, matchDetails: m };
      }
    }

    return { compatible: false, matchDetails: null };
  }

  async getCompatibilitiesByProduct(productId: string): Promise<ProductCompatibility[]> {
    return this.compatibilities.get(productId) || [];
  }
}

