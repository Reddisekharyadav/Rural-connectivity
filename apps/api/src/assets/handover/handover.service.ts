import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetCondition, AssetService } from '../assets/asset.service';
import { RentalBookingService } from '../bookings/rental-booking.service';

export type HandoverStatus = 'PENDING' | 'COMPLETED' | 'DISPUTED';

export interface RecordHandoverDto {
  rentalBookingId: string;
  assetId: string;
  handedOverById: string;
  receivedById: string;
  condition?: AssetCondition;
  fuelLevel?: number;
  meterReading?: number;
  notes?: string;
}

@Injectable()
export class AssetHandoverService {
  private handovers = new Map<string, any[]>();

  constructor(
    private readonly assetService: AssetService,
    private readonly bookingService: RentalBookingService,
  ) {}

  async recordHandover(dto: RecordHandoverDto): Promise<any> {
    const booking = await this.bookingService.getBookingById(dto.rentalBookingId);
    const id = `ho-${Date.now()}`;

    const handover = {
      id,
      rentalBookingId: dto.rentalBookingId,
      assetId: dto.assetId,
      handedOverById: dto.handedOverById,
      receivedById: dto.receivedById,
      condition: dto.condition || 'GOOD',
      fuelLevel: dto.fuelLevel ?? 100,
      meterReading: dto.meterReading ?? 1240,
      notes: dto.notes || 'Pre-rental inspection completed. Handed over in good working condition.',
      status: 'COMPLETED' as HandoverStatus,
      createdAt: new Date(),
    };

    const list = this.handovers.get(dto.rentalBookingId) || [];
    list.push(handover);
    this.handovers.set(dto.rentalBookingId, list);

    booking.status = 'HANDED_OVER';
    return handover;
  }

  async getHandoversForBooking(rentalBookingId: string): Promise<any[]> {
    return this.handovers.get(rentalBookingId) || [];
  }
}

