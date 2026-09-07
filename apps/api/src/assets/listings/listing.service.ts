import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetService } from '../assets/asset.service';

export type RentalMode =
  | 'EQUIPMENT_ONLY'
  | 'EQUIPMENT_WITH_OPERATOR'
  | 'EQUIPMENT_WITH_DELIVERY'
  | 'EQUIPMENT_OPERATOR_DELIVERY';

export type AssetPricingModel =
  | 'PER_HOUR'
  | 'PER_DAY'
  | 'PER_ACRE'
  | 'PER_TRIP'
  | 'PER_UNIT'
  | 'FIXED'
  | 'NEGOTIABLE';

export interface CreateListingDto {
  assetId: string;
  ownerId: string;
  title: string;
  description?: string;
  rentalMode: RentalMode;
  pricingModel: AssetPricingModel;
  price: number;
  currency?: string;
  minimumDuration?: number;
  maximumDuration?: number;
  requiresOperator?: boolean;
  deliveryAvailable?: boolean;
  pickupAvailable?: boolean;
  securityDeposit?: number;
}

export interface UpdateListingDto {
  title?: string;
  description?: string;
  rentalMode?: RentalMode;
  pricingModel?: AssetPricingModel;
  price?: number;
  minimumDuration?: number;
  maximumDuration?: number;
  requiresOperator?: boolean;
  deliveryAvailable?: boolean;
  pickupAvailable?: boolean;
  securityDeposit?: number;
  status?: string;
}

@Injectable()
export class RentalListingService {
  private listings = new Map<string, any>([
    [
      'list-001',
      {
        id: 'list-001',
        assetId: 'ast-001',
        ownerId: 'usr-suresh-001',
        ownerName: 'Suresh Reddy',
        title: '50 HP John Deere Tractor with Rotavator & Skilled Driver',
        description: 'Tractor with heavy duty rotavator ready for primary & secondary tillage.',
        rentalMode: 'EQUIPMENT_WITH_OPERATOR' as RentalMode,
        pricingModel: 'PER_DAY' as AssetPricingModel,
        price: 4500,
        currency: 'INR',
        minimumDuration: 1,
        maximumDuration: 10,
        requiresOperator: true,
        deliveryAvailable: true,
        pickupAvailable: true,
        securityDeposit: 0,
        status: 'ACTIVE',
        rating: 4.9,
        reviewsCount: 48,
        createdAt: new Date('2026-02-01T08:00:00Z'),
      },
    ],
    [
      'list-002',
      {
        id: 'list-002',
        assetId: 'ast-002',
        ownerId: 'usr-ramesh-002',
        ownerName: 'Ramesh Goud',
        title: '500L Tractor-Mounted Boom Sprayer (Foliar/Pesticide)',
        description: 'High-pressure calibrated boom sprayer for cotton and redgram farms.',
        rentalMode: 'EQUIPMENT_ONLY' as RentalMode,
        pricingModel: 'PER_DAY' as AssetPricingModel,
        price: 2200,
        currency: 'INR',
        minimumDuration: 1,
        maximumDuration: 5,
        requiresOperator: false,
        deliveryAvailable: true,
        pickupAvailable: true,
        securityDeposit: 1500,
        status: 'ACTIVE',
        rating: 4.7,
        reviewsCount: 32,
        createdAt: new Date('2026-02-15T09:00:00Z'),
      },
    ],
    [
      'list-003',
      {
        id: 'list-003',
        assetId: 'ast-003',
        ownerId: 'usr-fpo-001',
        ownerName: 'Tangipalli FPO Custom Hiring Center',
        title: '7.5 HP Diesel Water Pump with 3-inch Suction/Delivery Pipes',
        description: 'High discharge pump with 100ft delivery pipe for irrigation and tank refilling.',
        rentalMode: 'EQUIPMENT_WITH_DELIVERY' as RentalMode,
        pricingModel: 'PER_DAY' as AssetPricingModel,
        price: 1400,
        currency: 'INR',
        minimumDuration: 1,
        maximumDuration: 14,
        requiresOperator: false,
        deliveryAvailable: true,
        pickupAvailable: true,
        securityDeposit: 1000,
        status: 'ACTIVE',
        rating: 4.9,
        reviewsCount: 65,
        createdAt: new Date('2026-03-05T10:00:00Z'),
      },
    ],
    [
      'list-004',
      {
        id: 'list-004',
        assetId: 'ast-004',
        ownerId: 'usr-fpo-001',
        ownerName: 'Tangipalli FPO Custom Hiring Center',
        title: 'Combine Harvester with 2 Certified Operators',
        description: 'Multi-crop harvester for paddy, redgram, and soybean with grain tank.',
        rentalMode: 'EQUIPMENT_OPERATOR_DELIVERY' as RentalMode,
        pricingModel: 'PER_ACRE' as AssetPricingModel,
        price: 2400,
        currency: 'INR',
        minimumDuration: 1,
        requiresOperator: true,
        deliveryAvailable: true,
        pickupAvailable: false,
        securityDeposit: 3000,
        status: 'ACTIVE',
        rating: 5.0,
        reviewsCount: 18,
        createdAt: new Date('2026-04-10T11:00:00Z'),
      },
    ],
  ]);

  constructor(private readonly assetService: AssetService) {}

  async createListing(dto: CreateListingDto): Promise<any> {
    const asset = await this.assetService.getAssetById(dto.assetId);
    const id = `list-${Date.now()}`;
    const newListing = {
      id,
      assetId: dto.assetId,
      ownerId: dto.ownerId,
      title: dto.title,
      description: dto.description,
      rentalMode: dto.rentalMode,
      pricingModel: dto.pricingModel,
      price: dto.price,
      currency: dto.currency || 'INR',
      minimumDuration: dto.minimumDuration ?? 1,
      maximumDuration: dto.maximumDuration,
      requiresOperator: dto.requiresOperator ?? false,
      deliveryAvailable: dto.deliveryAvailable ?? false,
      pickupAvailable: dto.pickupAvailable ?? true,
      securityDeposit: dto.securityDeposit ?? 0,
      status: 'ACTIVE',
      asset,
      createdAt: new Date(),
    };

    this.listings.set(id, newListing);
    return newListing;
  }

  async getListingById(id: string): Promise<any> {
    const listing = this.listings.get(id);
    if (!listing) throw new NotFoundException(`RentalListing '${id}' not found`);
    return listing;
  }

  async listListings(filters?: {
    ownerId?: string;
    assetId?: string;
    rentalMode?: RentalMode;
    status?: string;
  }): Promise<any[]> {
    let list = Array.from(this.listings.values());
    if (filters?.ownerId) list = list.filter((l) => l.ownerId === filters.ownerId);
    if (filters?.assetId) list = list.filter((l) => l.assetId === filters.assetId);
    if (filters?.rentalMode) list = list.filter((l) => l.rentalMode === filters.rentalMode);
    if (filters?.status) list = list.filter((l) => l.status === filters.status);
    return list;
  }

  async updateListing(id: string, dto: UpdateListingDto): Promise<any> {
    const listing = await this.getListingById(id);
    const updated = { ...listing, ...dto, updatedAt: new Date() };
    this.listings.set(id, updated);
    return updated;
  }

  async deleteListing(id: string): Promise<{ success: boolean; deletedId: string }> {
    await this.getListingById(id);
    this.listings.delete(id);
    return { success: true, deletedId: id };
  }
}

