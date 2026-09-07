import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetType } from '../assets/asset.service';
import { RentalMode } from '../listings/listing.service';
import { AssetMatchingService, MatchedAssetResult } from '../matching/asset-matching.service';

export type RentalRequestStatus =
  | 'DRAFT'
  | 'OPEN'
  | 'MATCHED'
  | 'OFFER_RECEIVED'
  | 'BOOKED'
  | 'CANCELLED'
  | 'EXPIRED';

export interface CreateRentalRequestDto {
  createdById: string;
  assetType: AssetType;
  locationId: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  rentalMode?: RentalMode;
  quantity?: number;
  requirements?: Record<string, any>;
}

@Injectable()
export class RentalRequestService {
  private requests = new Map<string, any>([
    [
      'req-001',
      {
        id: 'req-001',
        createdById: 'usr-ravi-001',
        creatorName: 'Ravi Kumar (Cotton Farmer)',
        creatorPhone: '+91 98480 99887',
        assetType: 'TRACTOR' as AssetType,
        locationId: 'loc-tandur-01',
        village: 'Tangipalli',
        startDate: '2026-09-10',
        endDate: '2026-09-11',
        startTime: '07:00',
        endTime: '17:00',
        rentalMode: 'EQUIPMENT_WITH_OPERATOR' as RentalMode,
        quantity: 1,
        requirements: { minHp: 50, attachment: 'ROTAVATOR', operatorNeeded: true },
        status: 'OPEN' as RentalRequestStatus,
        createdAt: new Date('2026-09-08T06:00:00Z'),
      },
    ],
    [
      'req-002',
      {
        id: 'req-002',
        createdById: 'usr-ravi-001',
        creatorName: 'Ravi Kumar',
        creatorPhone: '+91 98480 99887',
        assetType: 'SPRAYER' as AssetType,
        locationId: 'loc-tandur-01',
        village: 'Tangipalli',
        startDate: '2026-09-12',
        rentalMode: 'EQUIPMENT_WITH_OPERATOR' as RentalMode,
        quantity: 1,
        requirements: { tankCapacity: 500, foliarSpraying: true },
        status: 'OPEN' as RentalRequestStatus,
        createdAt: new Date('2026-09-08T07:00:00Z'),
      },
    ],
  ]);

  constructor(private readonly matchingService: AssetMatchingService) {}

  async createRentalRequest(dto: CreateRentalRequestDto): Promise<any> {
    const id = `req-${Date.now()}`;
    const newReq = {
      id,
      createdById: dto.createdById,
      creatorName: 'Farmer (App User)',
      assetType: dto.assetType,
      locationId: dto.locationId,
      startDate: dto.startDate,
      endDate: dto.endDate,
      startTime: dto.startTime || '07:00',
      endTime: dto.endTime || '18:00',
      rentalMode: dto.rentalMode || 'EQUIPMENT_ONLY',
      quantity: dto.quantity || 1,
      requirements: dto.requirements,
      status: 'OPEN' as RentalRequestStatus,
      createdAt: new Date(),
    };

    this.requests.set(id, newReq);
    return newReq;
  }

  async getRentalRequestById(id: string): Promise<any> {
    const req = this.requests.get(id);
    if (!req) throw new NotFoundException(`RentalRequest '${id}' not found`);
    return req;
  }

  async listRentalRequests(filters?: {
    createdById?: string;
    assetType?: AssetType;
    status?: RentalRequestStatus;
  }): Promise<any[]> {
    let list = Array.from(this.requests.values());
    if (filters?.createdById) list = list.filter((r) => r.createdById === filters.createdById);
    if (filters?.assetType) list = list.filter((r) => r.assetType === filters.assetType);
    if (filters?.status) list = list.filter((r) => r.status === filters.status);
    return list;
  }

  async findMatchesForRequest(id: string): Promise<MatchedAssetResult[]> {
    const request = await this.getRentalRequestById(id);
    return this.matchingService.searchAssets({
      assetType: request.assetType,
      rentalMode: request.rentalMode,
    });
  }

  async cancelRentalRequest(id: string): Promise<any> {
    const req = await this.getRentalRequestById(id);
    req.status = 'CANCELLED';
    return req;
  }
}

