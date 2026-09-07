import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AssetService } from '../assets/asset.service';
import { RentalMode } from '../listings/listing.service';
import { RentalOfferService } from '../offers/rental-offer.service';
import { RentalBookingStateMachine, RentalBookingStatus } from './booking-state-machine';

export interface AcceptOfferAndBookDto {
  rentalOfferId: string;
  renterId: string;
  depositAmount?: number;
}

export interface DirectRentalBookingDto {
  assetId: string;
  ownerId: string;
  renterId: string;
  operatorId?: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  rentalMode?: RentalMode;
  totalAmount: number;
  depositAmount?: number;
}

@Injectable()
export class RentalBookingService {
  private bookings = new Map<string, any>([
    [
      'bkg-001',
      {
        id: 'bkg-001',
        rentalRequestId: 'req-001',
        rentalOfferId: 'ofr-001',
        assetId: 'ast-001',
        ownerId: 'usr-suresh-001',
        ownerName: 'Suresh Reddy',
        renterId: 'usr-ravi-001',
        renterName: 'Ravi Kumar',
        startDate: '2026-09-10',
        endDate: '2026-09-11',
        startTime: '07:00',
        endTime: '17:00',
        rentalMode: 'EQUIPMENT_WITH_OPERATOR' as RentalMode,
        totalAmount: 4500,
        depositAmount: 0,
        status: 'CONFIRMED' as RentalBookingStatus,
        createdAt: new Date('2026-09-08T09:00:00Z'),
      },
    ],
  ]);

  constructor(
    private readonly assetService: AssetService,
    private readonly offerService: RentalOfferService,
  ) {}

  async createFromOffer(dto: AcceptOfferAndBookDto): Promise<any> {
    const offer = await this.offerService.getOfferById(dto.rentalOfferId);
    if (offer.status !== 'OFFERED') {
      throw new BadRequestException(`Offer is no longer available (status: ${offer.status})`);
    }

    offer.status = 'ACCEPTED';
    const id = `bkg-${Date.now()}`;
    const booking = {
      id,
      rentalRequestId: offer.rentalRequestId,
      rentalOfferId: offer.id,
      assetId: offer.assetId,
      ownerId: offer.providerId,
      ownerName: offer.providerName,
      renterId: dto.renterId,
      renterName: 'Farmer (App User)',
      startDate: offer.expiresAt ? offer.expiresAt.toISOString().split('T')[0] : '2026-09-10',
      rentalMode: offer.rentalMode,
      totalAmount: offer.offeredRate,
      depositAmount: dto.depositAmount || 0,
      status: 'CONFIRMED' as RentalBookingStatus,
      asset: offer.asset,
      createdAt: new Date(),
    };

    this.bookings.set(id, booking);
    await this.assetService.updateAssetStatus(offer.assetId, 'RENTED');
    return booking;
  }

  async createDirectBooking(dto: DirectRentalBookingDto): Promise<any> {
    const asset = await this.assetService.getAssetById(dto.assetId);
    const id = `bkg-${Date.now()}`;

    const booking = {
      id,
      assetId: dto.assetId,
      ownerId: dto.ownerId,
      ownerName: asset.ownerName,
      renterId: dto.renterId,
      renterName: 'Farmer (App User)',
      operatorId: dto.operatorId,
      startDate: dto.startDate,
      endDate: dto.endDate,
      startTime: dto.startTime || '07:00',
      endTime: dto.endTime || '17:00',
      rentalMode: dto.rentalMode || 'EQUIPMENT_ONLY',
      totalAmount: dto.totalAmount,
      depositAmount: dto.depositAmount || 0,
      status: 'CONFIRMED' as RentalBookingStatus,
      asset,
      createdAt: new Date(),
    };

    this.bookings.set(id, booking);
    await this.assetService.updateAssetStatus(dto.assetId, 'RENTED');
    return booking;
  }

  async getBookingById(id: string): Promise<any> {
    const booking = this.bookings.get(id);
    if (!booking) throw new NotFoundException(`RentalBooking '${id}' not found`);
    return booking;
  }

  async listBookings(filters?: {
    ownerId?: string;
    renterId?: string;
    assetId?: string;
    status?: RentalBookingStatus;
  }): Promise<any[]> {
    let list = Array.from(this.bookings.values());
    if (filters?.ownerId) list = list.filter((b) => b.ownerId === filters.ownerId);
    if (filters?.renterId) list = list.filter((b) => b.renterId === filters.renterId);
    if (filters?.assetId) list = list.filter((b) => b.assetId === filters.assetId);
    if (filters?.status) list = list.filter((b) => b.status === filters.status);
    return list;
  }

  async updateBookingStatus(id: string, targetStatus: RentalBookingStatus): Promise<any> {
    const booking = await this.getBookingById(id);
    RentalBookingStateMachine.validateTransition(booking.status, targetStatus);
    booking.status = targetStatus;

    if (targetStatus === 'COMPLETED' || targetStatus === 'CANCELLED') {
      await this.assetService.updateAssetStatus(booking.assetId, 'ACTIVE');
    }

    return booking;
  }
}

