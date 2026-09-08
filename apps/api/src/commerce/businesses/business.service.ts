import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

export type BusinessType =
  | 'AGRI_INPUT_SHOP'
  | 'MACHINERY_DEALER'
  | 'SPARE_PARTS_SHOP'
  | 'REPAIR_SHOP'
  | 'MECHANIC'
  | 'ELECTRICAL_SERVICE'
  | 'PLUMBING_SERVICE'
  | 'WELDING_SERVICE'
  | 'FABRICATION'
  | 'CONSTRUCTION'
  | 'TRANSPORT'
  | 'EQUIPMENT_REPAIR'
  | 'GENERAL_RETAIL'
  | 'LOCAL_SERVICE'
  | 'OTHER';

export type VerificationStatus = 'UNVERIFIED' | 'VERIFIED' | 'GOLD' | 'PLATINUM';

export interface BusinessProfile {
  id: string;
  ownerId: string;
  organizationId?: string | null;
  businessName: string;
  businessType: BusinessType;
  description?: string | null;
  phone: string;
  email?: string | null;
  locationId: string;
  village?: string;
  lat?: number;
  lng?: number;
  serviceRadiusKm: number;
  verificationStatus: VerificationStatus;
  rating: number;
  totalReviews: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class BusinessService {
  private businesses = new Map<string, BusinessProfile>([
    [
      'biz-001',
      {
        id: 'biz-001',
        ownerId: 'usr-suresh-001',
        businessName: 'Sri Sai Agro Machinery & Spare Parts',
        businessType: 'SPARE_PARTS_SHOP',
        description: 'Authorized OEM filters, hydraulic hoses, tractor spares & sprayers in Tandur',
        phone: '+91 98480 12345',
        email: 'srisai.machinery@ruralconnect.in',
        locationId: 'loc-tandur-01',
        village: 'Tangipalli',
        lat: 17.2543,
        lng: 77.5821,
        serviceRadiusKm: 25.0,
        verificationStatus: 'VERIFIED',
        rating: 4.8,
        totalReviews: 24,
        status: 'ACTIVE',
        createdAt: new Date('2026-08-01T10:00:00Z'),
        updatedAt: new Date('2026-09-01T10:00:00Z'),
      },
    ],
    [
      'biz-002',
      {
        id: 'biz-002',
        ownerId: 'usr-ramesh-002',
        businessName: 'Ramesh Agri Mechanics & Pump Rewinding',
        businessType: 'MECHANIC',
        description: 'Tractor engine repair, submersible pump rewinding, mobile farm breakdown service',
        phone: '+91 98765 43210',
        email: 'ramesh.mechanic@ruralconnect.in',
        locationId: 'loc-tandur-02',
        village: 'Malkapur',
        lat: 17.2711,
        lng: 77.5934,
        serviceRadiusKm: 20.0,
        verificationStatus: 'VERIFIED',
        rating: 4.9,
        totalReviews: 48,
        status: 'ACTIVE',
        createdAt: new Date('2026-08-10T10:00:00Z'),
        updatedAt: new Date('2026-09-02T10:00:00Z'),
      },
    ],
    [
      'biz-003',
      {
        id: 'biz-003',
        ownerId: 'usr-fpo-admin-01',
        organizationId: 'org-tandur-fpo',
        businessName: 'Tangipalli Rythu Seva Samithi Agro Mart',
        businessType: 'AGRI_INPUT_SHOP',
        description: 'Certified seeds, bio-fertilizers, sprinkler fittings, and farmer inputs',
        phone: '+91 94401 22334',
        email: 'agro.mart@tangipallifpo.org',
        locationId: 'loc-tandur-03',
        village: 'Tangipalli',
        lat: 17.251,
        lng: 77.579,
        serviceRadiusKm: 30.0,
        verificationStatus: 'GOLD',
        rating: 5.0,
        totalReviews: 86,
        status: 'ACTIVE',
        createdAt: new Date('2026-07-15T10:00:00Z'),
        updatedAt: new Date('2026-09-05T10:00:00Z'),
      },
    ],
  ]);

  async createBusiness(data: {
    ownerId: string;
    organizationId?: string;
    businessName: string;
    businessType?: BusinessType;
    description?: string;
    phone: string;
    email?: string;
    locationId: string;
    village?: string;
    lat?: number;
    lng?: number;
    serviceRadiusKm?: number;
  }): Promise<BusinessProfile> {
    if (!data.businessName || !data.phone || !data.locationId || !data.ownerId) {
      throw new BadRequestException('Missing mandatory business registration fields (businessName, phone, locationId, ownerId)');
    }

    const id = `biz-${Date.now().toString().slice(-6)}`;
    const business: BusinessProfile = {
      id,
      ownerId: data.ownerId,
      organizationId: data.organizationId || null,
      businessName: data.businessName,
      businessType: data.businessType || 'GENERAL_RETAIL',
      description: data.description || null,
      phone: data.phone,
      email: data.email || null,
      locationId: data.locationId,
      village: data.village || 'Tandur',
      lat: data.lat || 17.2543,
      lng: data.lng || 77.5821,
      serviceRadiusKm: data.serviceRadiusKm || 15.0,
      verificationStatus: 'VERIFIED',
      rating: 5.0,
      totalReviews: 1,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.businesses.set(id, business);
    return business;
  }

  async getBusinessById(id: string): Promise<BusinessProfile> {
    const business = this.businesses.get(id);
    if (!business) {
      throw new NotFoundException(`Business with ID '${id}' not found`);
    }
    return business;
  }

  async listBusinesses(filter?: {
    businessType?: BusinessType;
    status?: string;
    locationId?: string;
  }): Promise<BusinessProfile[]> {
    let list = Array.from(this.businesses.values());
    if (filter?.businessType) {
      list = list.filter((b) => b.businessType === filter.businessType);
    }
    if (filter?.status) {
      list = list.filter((b) => b.status === filter.status);
    }
    if (filter?.locationId) {
      list = list.filter((b) => b.locationId === filter.locationId);
    }
    return list.sort((a, b) => b.rating - a.rating);
  }

  async updateVerification(id: string, verificationStatus: VerificationStatus): Promise<BusinessProfile> {
    const business = await this.getBusinessById(id);
    business.verificationStatus = verificationStatus;
    business.updatedAt = new Date();
    this.businesses.set(id, business);
    return business;
  }
}
