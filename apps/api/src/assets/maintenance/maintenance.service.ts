import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetService } from '../assets/asset.service';

export type MaintenanceType =
  | 'ROUTINE_SERVICE'
  | 'REPAIR'
  | 'OIL_CHANGE'
  | 'TYRE_REPLACEMENT'
  | 'ENGINE_SERVICE'
  | 'INSPECTION'
  | 'OTHER';

export type MaintenanceStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface CreateMaintenanceDto {
  assetId: string;
  maintenanceType: MaintenanceType;
  description: string;
  serviceProviderId?: string;
  cost?: number;
  currency?: string;
  performedAt?: string;
  nextDueAt?: string;
  meterReading?: number;
  status?: MaintenanceStatus;
}

@Injectable()
export class AssetMaintenanceService {
  private records = new Map<string, any[]>([
    [
      'ast-001',
      [
        {
          id: 'maint-001',
          assetId: 'ast-001',
          maintenanceType: 'OIL_CHANGE' as MaintenanceType,
          description: 'Engine oil & filter replacement (15W-40 CI4)',
          cost: 3200,
          currency: 'INR',
          performedAt: new Date('2026-08-15T10:00:00Z'),
          nextDueAt: new Date('2026-11-15T10:00:00Z'),
          meterReading: 1150,
          status: 'COMPLETED' as MaintenanceStatus,
          createdAt: new Date('2026-08-15T10:00:00Z'),
        },
      ],
    ],
  ]);

  constructor(private readonly assetService: AssetService) {}

  async createRecord(dto: CreateMaintenanceDto): Promise<any> {
    const asset = await this.assetService.getAssetById(dto.assetId);
    const id = `maint-${Date.now()}`;

    const record = {
      id,
      assetId: dto.assetId,
      assetName: asset.name,
      maintenanceType: dto.maintenanceType,
      description: dto.description,
      serviceProviderId: dto.serviceProviderId,
      cost: dto.cost || 0,
      currency: dto.currency || 'INR',
      performedAt: dto.performedAt ? new Date(dto.performedAt) : new Date(),
      nextDueAt: dto.nextDueAt ? new Date(dto.nextDueAt) : undefined,
      meterReading: dto.meterReading,
      status: dto.status || 'COMPLETED',
      createdAt: new Date(),
    };

    const list = this.records.get(dto.assetId) || [];
    list.unshift(record);
    this.records.set(dto.assetId, list);

    if (dto.status === 'IN_PROGRESS') {
      await this.assetService.updateAssetStatus(dto.assetId, 'UNDER_MAINTENANCE');
    }

    return record;
  }

  async getRecordsForAsset(assetId: string): Promise<any[]> {
    return this.records.get(assetId) || [];
  }

  async updateRecord(id: string, dto: Partial<CreateMaintenanceDto>): Promise<any> {
    let foundRecord: any = null;
    for (const list of this.records.values()) {
      const rec = list.find((r) => r.id === id);
      if (rec) {
        foundRecord = rec;
        break;
      }
    }

    if (!foundRecord) throw new NotFoundException(`MaintenanceRecord '${id}' not found`);

    Object.assign(foundRecord, dto);
    if (dto.status === 'COMPLETED') {
      await this.assetService.updateAssetStatus(foundRecord.assetId, 'ACTIVE');
    }

    return foundRecord;
  }
}

