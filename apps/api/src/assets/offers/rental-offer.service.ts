import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AssetService } from '../assets/asset.service';
import { RentalMode } from '../listings/listing.service';
import { RentalRequestService } from '../rental-requests/rental-request.service';

export type RentalOfferStatus = 'OFFERED' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN' | 'EXPIRED';

export interface CreateRentalOfferDto {
  rentalRequestId: string;
  assetId: string;
  providerId: string;
  operatorId?: string;
  offeredRate: number;
  rentalMode?: RentalMode;
  message?: string;
  expiresInHours?: number;
}

@Injectable()
export class RentalOfferService {
  private offers = new Map<string, any>([
    [
      'ofr-001',
      {
        id: 'ofr-001',
        rentalRequestId: 'req-001',
        assetId: 'ast-001',
        providerId: 'usr-suresh-001',
        providerName: 'Suresh Reddy',
        providerPhone: '+91 98480 12345',
        providerRating: 4.9,
        offeredRate: 4500,
        rentalMode: 'EQUIPMENT_WITH_OPERATOR' as RentalMode,
        message: 'Available on Sept 10. Tractor with 42-blade rotavator and experienced driver.',
        expiresAt: new Date('2026-09-09T23:59:59Z'),
        status: 'OFFERED' as RentalOfferStatus,
        createdAt: new Date('2026-09-08T08:30:00Z'),
      },
    ],
  ]);

  constructor(
    private readonly assetService: AssetService,
    private readonly requestService: RentalRequestService,
  ) {}

  async createOffer(dto: CreateRentalOfferDto): Promise<any> {
    const request = await this.requestService.getRentalRequestById(dto.rentalRequestId);
    const asset = await this.assetService.getAssetById(dto.assetId);

    const id = `ofr-${Date.now()}`;
    const expiresAt = dto.expiresInHours
      ? new Date(Date.now() + dto.expiresInHours * 3600 * 1000)
      : new Date(Date.now() + 48 * 3600 * 1000);

    const offer = {
      id,
      rentalRequestId: dto.rentalRequestId,
      assetId: dto.assetId,
      providerId: dto.providerId,
      providerName: asset.ownerName,
      providerPhone: asset.ownerPhone,
      providerRating: asset.ownerRating,
      operatorId: dto.operatorId,
      offeredRate: dto.offeredRate,
      rentalMode: dto.rentalMode || 'EQUIPMENT_ONLY',
      message: dto.message,
      expiresAt,
      status: 'OFFERED' as RentalOfferStatus,
      asset,
      createdAt: new Date(),
    };

    this.offers.set(id, offer);
    request.status = 'OFFER_RECEIVED';
    return offer;
  }

  async getOfferById(id: string): Promise<any> {
    const offer = this.offers.get(id);
    if (!offer) throw new NotFoundException(`RentalOffer '${id}' not found`);
    return offer;
  }

  async listOffersForRequest(rentalRequestId: string): Promise<any[]> {
    return Array.from(this.offers.values()).filter((o) => o.rentalRequestId === rentalRequestId);
  }

  async rejectOffer(id: string): Promise<any> {
    const offer = await this.getOfferById(id);
    if (offer.status !== 'OFFERED') {
      throw new BadRequestException(`Cannot reject offer with status '${offer.status}'`);
    }
    offer.status = 'REJECTED';
    return offer;
  }

  async withdrawOffer(id: string, providerId: string): Promise<any> {
    const offer = await this.getOfferById(id);
    if (offer.providerId !== providerId) {
      throw new BadRequestException(`Only the offering provider can withdraw this offer`);
    }
    offer.status = 'WITHDRAWN';
    return offer;
  }
}

