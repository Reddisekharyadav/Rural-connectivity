import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BusinessService } from '../businesses/business.service';

export interface BusinessLocation {
  id: string;
  businessId: string;
  name: string;
  locationId: string;
  phone?: string | null;
  openingTime: string;
  closingTime: string;
  isPrimary: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class BusinessLocationService {
  private locations = new Map<string, BusinessLocation>([
    [
      'bloc-001',
      {
        id: 'bloc-001',
        businessId: 'biz-001',
        name: 'Main Workshop & Spares Depot',
        locationId: 'loc-tandur-01',
        phone: '+91 98480 12345',
        openingTime: '08:00',
        closingTime: '20:30',
        isPrimary: true,
        status: 'ACTIVE',
        createdAt: new Date('2026-08-01T10:00:00Z'),
        updatedAt: new Date('2026-08-01T10:00:00Z'),
      },
    ],
    [
      'bloc-002',
      {
        id: 'bloc-002',
        businessId: 'biz-001',
        name: 'Tandur Mandi Branch',
        locationId: 'loc-tandur-mandi',
        phone: '+91 98480 12346',
        openingTime: '07:30',
        closingTime: '19:30',
        isPrimary: false,
        status: 'ACTIVE',
        createdAt: new Date('2026-08-15T10:00:00Z'),
        updatedAt: new Date('2026-08-15T10:00:00Z'),
      },
    ],
  ]);

  constructor(private readonly businessService: BusinessService) {}

  async createLocation(
    businessId: string,
    data: {
      name: string;
      locationId: string;
      phone?: string;
      openingTime?: string;
      closingTime?: string;
      isPrimary?: boolean;
    },
  ): Promise<BusinessLocation> {
    const business = await this.businessService.getBusinessById(businessId);
    if (!business) {
      throw new NotFoundException(`Business with ID '${businessId}' not found`);
    }

    if (!data.name || !data.locationId) {
      throw new BadRequestException('Location branch name and locationId are required');
    }

    if (data.isPrimary) {
      for (const loc of this.locations.values()) {
        if (loc.businessId === businessId) {
          loc.isPrimary = false;
        }
      }
    }

    const id = `bloc-${Date.now().toString().slice(-6)}`;
    const location: BusinessLocation = {
      id,
      businessId,
      name: data.name,
      locationId: data.locationId,
      phone: data.phone || business.phone,
      openingTime: data.openingTime || '08:00',
      closingTime: data.closingTime || '20:00',
      isPrimary: data.isPrimary ?? false,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.locations.set(id, location);
    return location;
  }

  async getLocationsByBusiness(businessId: string): Promise<BusinessLocation[]> {
    const list: BusinessLocation[] = [];
    for (const loc of this.locations.values()) {
      if (loc.businessId === businessId && loc.status === 'ACTIVE') {
        list.push(loc);
      }
    }
    return list.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
  }
}
