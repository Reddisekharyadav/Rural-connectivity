import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetService } from '../assets/asset.service';
import { RentalBookingService } from '../bookings/rental-booking.service';

export type AssetInspectionType = 'PRE_RENTAL' | 'POST_RENTAL' | 'DAMAGE' | 'MAINTENANCE';
export type AssetInspectionCondition = 'GOOD' | 'MINOR_DAMAGE' | 'MAJOR_DAMAGE' | 'NON_FUNCTIONAL';

export interface CreateInspectionDto {
  rentalBookingId?: string;
  assetId: string;
  inspectionType: AssetInspectionType;
  inspectedById: string;
  condition: AssetInspectionCondition;
  meterReading?: number;
  fuelLevel?: number;
  damageReported?: boolean;
  damageCostEstimate?: number;
  notes?: string;
}

@Injectable()
export class AssetInspectionService {
  private inspections = new Map<string, any[]>();

  constructor(
    private readonly assetService: AssetService,
    private readonly bookingService: RentalBookingService,
  ) {}

  async createInspection(dto: CreateInspectionDto): Promise<any> {
    const asset = await this.assetService.getAssetById(dto.assetId);
    const id = `insp-${Date.now()}`;

    const inspection = {
      id,
      rentalBookingId: dto.rentalBookingId,
      assetId: dto.assetId,
      assetName: asset.name,
      inspectionType: dto.inspectionType,
      inspectedById: dto.inspectedById,
      condition: dto.condition,
      meterReading: dto.meterReading ?? 1248,
      fuelLevel: dto.fuelLevel ?? 90,
      damageReported: dto.damageReported ?? false,
      damageCostEstimate: dto.damageCostEstimate ?? 0,
      notes: dto.notes || 'Routine pre/post rental inspection conducted.',
      createdAt: new Date(),
    };

    const assetList = this.inspections.get(dto.assetId) || [];
    assetList.push(inspection);
    this.inspections.set(dto.assetId, assetList);

    if (dto.rentalBookingId) {
      const bookingList = this.inspections.get(dto.rentalBookingId) || [];
      bookingList.push(inspection);
      this.inspections.set(dto.rentalBookingId, bookingList);

      if (dto.inspectionType === 'POST_RENTAL') {
        const nextStatus = dto.damageReported ? 'DISPUTED' : 'INSPECTED';
        await this.bookingService.updateBookingStatus(dto.rentalBookingId, nextStatus);
      }
    }

    return inspection;
  }

  async getInspectionsForAsset(assetId: string): Promise<any[]> {
    return this.inspections.get(assetId) || [];
  }

  async getInspectionsForBooking(rentalBookingId: string): Promise<any[]> {
    return this.inspections.get(rentalBookingId) || [];
  }
}

