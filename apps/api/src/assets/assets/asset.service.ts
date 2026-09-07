import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetStateMachine, AssetStatus } from './asset-state-machine';

export type AssetType =
  | 'TRACTOR'
  | 'SPRAYER'
  | 'PUMP'
  | 'WATER_PUMP'
  | 'TRAILER'
  | 'ROTAVATOR'
  | 'PLOUGH'
  | 'CULTIVATOR'
  | 'HARROW'
  | 'SEED_DRILL'
  | 'LAND_LEVELER'
  | 'HARVESTER'
  | 'IRRIGATION_EQUIPMENT'
  | 'THRESHER'
  | 'OTHER';

export type AssetCondition = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED' | 'NON_FUNCTIONAL';

export interface CreateAssetDto {
  ownerId: string;
  organizationId?: string;
  assetType: AssetType;
  name: string;
  brand: string;
  model: string;
  serialNumber?: string;
  registrationNumber?: string;
  manufacturingYear?: number;
  capacity?: number;
  capacityUnit?: string;
  condition?: AssetCondition;
  baseLocationId: string;
  description?: string;
  hourlyRate?: number;
  dailyRate?: number;
}

export interface UpdateAssetDto {
  name?: string;
  brand?: string;
  model?: string;
  condition?: AssetCondition;
  description?: string;
  hourlyRate?: number;
  dailyRate?: number;
  baseLocationId?: string;
}

@Injectable()
export class AssetService {
  private assets = new Map<string, any>([
    [
      'ast-001',
      {
        id: 'ast-001',
        ownerId: 'usr-suresh-001',
        ownerName: 'Suresh Reddy (Sri Sai Fleet)',
        ownerPhone: '+91 98480 12345',
        ownerRating: 4.9,
        ownerVerificationTier: 3,
        assetType: 'TRACTOR',
        name: 'John Deere 5050D PowerPro',
        brand: 'John Deere',
        model: '5050D',
        manufacturingYear: 2023,
        capacity: 50,
        capacityUnit: 'HP',
        condition: 'EXCELLENT',
        status: 'ACTIVE',
        baseLocationId: 'loc-tandur-01',
        village: 'Tangipalli',
        mandal: 'Tandur',
        district: 'Vikarabad',
        latitude: 17.258,
        longitude: 77.585,
        hourlyRate: 650,
        dailyRate: 4500,
        rating: 4.9,
        totalRentals: 48,
        specifications: [
          { id: 'sp-01', key: 'hp', value: '50', unit: 'HP' },
          { id: 'sp-02', key: 'fuelType', value: 'DIESEL' },
          { id: 'sp-03', key: 'transmission', value: '8F+4R Collarshift' },
        ],
        attachments: [
          { id: 'att-01', attachmentType: 'ROTAVATOR', compatible: true, notes: 'Shaktiman 42-blade heavy duty' },
          { id: 'att-02', attachmentType: 'TRAILER', compatible: true, notes: '5-ton hydraulic tipping trailer' },
        ],
        createdAt: new Date('2026-01-15T08:00:00Z'),
      },
    ],
    [
      'ast-002',
      {
        id: 'ast-002',
        ownerId: 'usr-ramesh-002',
        ownerName: 'Ramesh Goud',
        ownerPhone: '+91 98765 43210',
        ownerRating: 4.8,
        ownerVerificationTier: 2,
        assetType: 'SPRAYER',
        name: 'Aspee 500L Tractor-Mounted Boom Sprayer',
        brand: 'Aspee',
        model: 'HTP-500B',
        manufacturingYear: 2024,
        capacity: 500,
        capacityUnit: 'LITRE',
        condition: 'GOOD',
        status: 'ACTIVE',
        baseLocationId: 'loc-tandur-02',
        village: 'Malkapur',
        mandal: 'Tandur',
        district: 'Vikarabad',
        latitude: 17.272,
        longitude: 77.58,
        hourlyRate: 350,
        dailyRate: 2200,
        rating: 4.7,
        totalRentals: 32,
        specifications: [
          { id: 'sp-04', key: 'tankCapacity', value: '500', unit: 'LITRE' },
          { id: 'sp-05', key: 'boomLength', value: '12', unit: 'METRE' },
          { id: 'sp-06', key: 'nozzleCount', value: '24' },
        ],
        attachments: [],
        createdAt: new Date('2026-02-10T09:00:00Z'),
      },
    ],
    [
      'ast-003',
      {
        id: 'ast-003',
        ownerId: 'usr-fpo-001',
        organizationId: 'org-tandur-fpo',
        ownerName: 'Tangipalli Rythu Seva Samithi (FPO)',
        ownerPhone: '+91 94401 22334',
        ownerRating: 5.0,
        ownerVerificationTier: 4,
        assetType: 'WATER_PUMP',
        name: 'Kirloskar 7.5 HP Diesel High-Discharge Pump',
        brand: 'Kirloskar',
        model: 'KDS-750',
        manufacturingYear: 2024,
        capacity: 7.5,
        capacityUnit: 'HP',
        condition: 'EXCELLENT',
        status: 'ACTIVE',
        baseLocationId: 'loc-tandur-01',
        village: 'Tangipalli',
        mandal: 'Tandur',
        district: 'Vikarabad',
        latitude: 17.25,
        longitude: 77.58,
        hourlyRate: 200,
        dailyRate: 1400,
        rating: 4.9,
        totalRentals: 65,
        specifications: [
          { id: 'sp-07', key: 'power', value: '7.5', unit: 'HP' },
          { id: 'sp-08', key: 'pipeDiameter', value: '3', unit: 'INCH' },
          { id: 'sp-09', key: 'maxHead', value: '25', unit: 'METRE' },
        ],
        attachments: [],
        createdAt: new Date('2026-03-01T10:00:00Z'),
      },
    ],
    [
      'ast-004',
      {
        id: 'ast-004',
        ownerId: 'usr-fpo-001',
        organizationId: 'org-tandur-fpo',
        ownerName: 'Tangipalli Rythu Seva Samithi (FPO)',
        ownerPhone: '+91 94401 22334',
        ownerRating: 5.0,
        ownerVerificationTier: 4,
        assetType: 'HARVESTER',
        name: 'Preet 987 Multi-Crop Combine Harvester',
        brand: 'Preet',
        model: '987 Deluxe',
        manufacturingYear: 2025,
        capacity: 101,
        capacityUnit: 'HP',
        condition: 'EXCELLENT',
        status: 'ACTIVE',
        baseLocationId: 'loc-tandur-01',
        village: 'Tangipalli',
        mandal: 'Tandur',
        district: 'Vikarabad',
        latitude: 17.25,
        longitude: 77.58,
        hourlyRate: 2200,
        dailyRate: 16000,
        rating: 5.0,
        totalRentals: 18,
        specifications: [
          { id: 'sp-10', key: 'cutterBarWidth', value: '14', unit: 'FOOT' },
          { id: 'sp-11', key: 'grainTankCapacity', value: '1800', unit: 'LITRE' },
        ],
        attachments: [],
        createdAt: new Date('2026-04-01T11:00:00Z'),
      },
    ],
  ]);

  async createAsset(dto: CreateAssetDto): Promise<any> {
    const id = `ast-${Date.now()}`;
    const newAsset = {
      id,
      ownerId: dto.ownerId,
      organizationId: dto.organizationId,
      assetType: dto.assetType,
      name: dto.name,
      brand: dto.brand,
      model: dto.model,
      serialNumber: dto.serialNumber,
      registrationNumber: dto.registrationNumber,
      manufacturingYear: dto.manufacturingYear,
      capacity: dto.capacity,
      capacityUnit: dto.capacityUnit,
      condition: dto.condition || 'GOOD',
      status: 'ACTIVE' as AssetStatus,
      baseLocationId: dto.baseLocationId,
      description: dto.description,
      hourlyRate: dto.hourlyRate,
      dailyRate: dto.dailyRate,
      rating: 5.0,
      totalRentals: 0,
      specifications: [],
      attachments: [],
      createdAt: new Date(),
    };

    this.assets.set(id, newAsset);
    return newAsset;
  }

  async getAssetById(id: string): Promise<any> {
    const asset = this.assets.get(id);
    if (!asset) throw new NotFoundException(`Asset '${id}' not found`);
    return asset;
  }

  async listAssets(filters?: {
    ownerId?: string;
    organizationId?: string;
    assetType?: AssetType;
    status?: AssetStatus;
    baseLocationId?: string;
  }): Promise<any[]> {
    let list = Array.from(this.assets.values());
    if (filters?.ownerId) list = list.filter((a) => a.ownerId === filters.ownerId);
    if (filters?.organizationId) list = list.filter((a) => a.organizationId === filters.organizationId);
    if (filters?.assetType) list = list.filter((a) => a.assetType === filters.assetType);
    if (filters?.status) list = list.filter((a) => a.status === filters.status);
    if (filters?.baseLocationId) list = list.filter((a) => a.baseLocationId === filters.baseLocationId);
    return list;
  }

  async updateAsset(id: string, dto: UpdateAssetDto): Promise<any> {
    const asset = await this.getAssetById(id);
    const updated = { ...asset, ...dto, updatedAt: new Date() };
    this.assets.set(id, updated);
    return updated;
  }

  async updateAssetStatus(id: string, targetStatus: AssetStatus): Promise<any> {
    const asset = await this.getAssetById(id);
    AssetStateMachine.validateTransition(asset.status, targetStatus);
    const updated = { ...asset, status: targetStatus, updatedAt: new Date() };
    this.assets.set(id, updated);
    return updated;
  }

  async deleteAsset(id: string): Promise<{ success: boolean; deletedId: string }> {
    await this.getAssetById(id);
    this.assets.delete(id);
    return { success: true, deletedId: id };
  }
}

