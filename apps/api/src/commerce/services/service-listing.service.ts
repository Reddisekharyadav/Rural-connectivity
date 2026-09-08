import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BusinessService, BusinessProfile } from '../businesses/business.service';
import { ServiceCategoryService, ServiceCategory } from '../categories/service-category.service';

export type ServicePricingModel =
  | 'FIXED'
  | 'PER_HOUR'
  | 'PER_DAY'
  | 'PER_VISIT'
  | 'PER_UNIT'
  | 'INSPECTION_FIRST'
  | 'NEGOTIABLE';

export interface ServiceListing {
  id: string;
  businessId: string;
  business?: BusinessProfile;
  categoryId: string;
  category?: ServiceCategory;
  title: string;
  description?: string | null;
  pricingModel: ServicePricingModel;
  basePrice?: number | null;
  hourlyRate?: number | null;
  inspectionFee: number;
  currency: string;
  serviceRadiusKm: number;
  locationId?: string | null;
  requiresAppointment: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ServiceListingService {
  private listings = new Map<string, ServiceListing>([
    [
      'svc-001',
      {
        id: 'svc-001',
        businessId: 'biz-002',
        categoryId: 'scat-001',
        title: 'Tractor Engine & Hydraulic Diagnostic & Repair',
        description: 'Complete on-farm or workshop inspection, fuel pump calibration & hydraulic lift repair',
        pricingModel: 'INSPECTION_FIRST',
        basePrice: null,
        hourlyRate: 180.0,
        inspectionFee: 500.0,
        currency: 'INR',
        serviceRadiusKm: 25.0,
        locationId: 'loc-tandur-02',
        requiresAppointment: true,
        status: 'ACTIVE',
        createdAt: new Date('2026-08-10T10:00:00Z'),
        updatedAt: new Date('2026-08-10T10:00:00Z'),
      },
    ],
    [
      'svc-002',
      {
        id: 'svc-002',
        businessId: 'biz-002',
        categoryId: 'scat-002',
        title: 'Submersible Agricultural Borewell Pump Rewinding',
        description: 'Copper wire motor rewinding, thrust bearing replacement, and insulation test with 6-month warranty',
        pricingModel: 'FIXED',
        basePrice: 2800.0,
        hourlyRate: null,
        inspectionFee: 300.0,
        currency: 'INR',
        serviceRadiusKm: 20.0,
        locationId: 'loc-tandur-02',
        requiresAppointment: true,
        status: 'ACTIVE',
        createdAt: new Date('2026-08-12T10:00:00Z'),
        updatedAt: new Date('2026-08-12T10:00:00Z'),
      },
    ],
    [
      'svc-003',
      {
        id: 'svc-003',
        businessId: 'biz-001',
        categoryId: 'scat-003',
        title: 'Agricultural Implement Welding & Trailer Fabrication',
        description: 'Arc & MIG welding for cracked tractor drawbars, rotavator flange welding, and trailer chassis repair',
        pricingModel: 'PER_HOUR',
        basePrice: 350.0,
        hourlyRate: 250.0,
        inspectionFee: 200.0,
        currency: 'INR',
        serviceRadiusKm: 15.0,
        locationId: 'loc-tandur-01',
        requiresAppointment: false,
        status: 'ACTIVE',
        createdAt: new Date('2026-08-15T10:00:00Z'),
        updatedAt: new Date('2026-08-15T10:00:00Z'),
      },
    ],
  ]);

  constructor(
    private readonly businessService: BusinessService,
    private readonly categoryService: ServiceCategoryService,
  ) {}

  async createListing(data: {
    businessId: string;
    categoryId: string;
    title: string;
    description?: string;
    pricingModel?: ServicePricingModel;
    basePrice?: number;
    hourlyRate?: number;
    inspectionFee?: number;
    serviceRadiusKm?: number;
    locationId?: string;
    requiresAppointment?: boolean;
  }): Promise<ServiceListing> {
    const business = await this.businessService.getBusinessById(data.businessId);
    const category = await this.categoryService.getCategoryById(data.categoryId);

    if (!data.title) {
      throw new BadRequestException('Service listing title is required');
    }

    const id = `svc-${Date.now().toString().slice(-6)}`;
    const listing: ServiceListing = {
      id,
      businessId: data.businessId,
      business,
      categoryId: data.categoryId,
      category,
      title: data.title,
      description: data.description || null,
      pricingModel: data.pricingModel || 'FIXED',
      basePrice: data.basePrice || null,
      hourlyRate: data.hourlyRate || null,
      inspectionFee: data.inspectionFee || 0.0,
      currency: 'INR',
      serviceRadiusKm: data.serviceRadiusKm || business.serviceRadiusKm || 20.0,
      locationId: data.locationId || business.locationId,
      requiresAppointment: data.requiresAppointment ?? true,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.listings.set(id, listing);
    return listing;
  }

  async listListings(filter?: {
    categoryId?: string;
    businessId?: string;
    search?: string;
  }): Promise<ServiceListing[]> {
    let list = Array.from(this.listings.values());
    if (filter?.categoryId) {
      list = list.filter((l) => l.categoryId === filter.categoryId);
    }
    if (filter?.businessId) {
      list = list.filter((l) => l.businessId === filter.businessId);
    }
    if (filter?.search) {
      const s = filter.search.toLowerCase();
      list = list.filter(
        (l) =>
          l.title.toLowerCase().includes(s) ||
          (l.description && l.description.toLowerCase().includes(s)),
      );
    }
    return list.filter((l) => l.status === 'ACTIVE');
  }

  async getListingById(id: string): Promise<ServiceListing> {
    const listing = this.listings.get(id);
    if (!listing) {
      throw new NotFoundException(`Service listing with ID '${id}' not found`);
    }
    if (!listing.business) {
      try {
        listing.business = await this.businessService.getBusinessById(listing.businessId);
      } catch {}
    }
    if (!listing.category) {
      try {
        listing.category = await this.categoryService.getCategoryById(listing.categoryId);
      } catch {}
    }
    return listing;
  }

  async bridgeToWorkRequest(
    listingId: string,
    customerData: {
      customerId: string;
      locationId: string;
      description: string;
      preferredDate?: string;
    },
  ) {
    const listing = await this.getListingById(listingId);
    const refCode = `REQ-SVC-${Date.now().toString().slice(-6)}`;

    return {
      workRequestId: `wrk-${Date.now().toString().slice(-6)}`,
      referenceCode: refCode,
      serviceTitle: listing.title,
      businessName: listing.business?.businessName,
      customerLocationId: customerData.locationId,
      pricingModel: listing.pricingModel,
      inspectionFee: listing.inspectionFee,
      hourlyRate: listing.hourlyRate,
      status: 'CONFIRMED',
      message: `WorkRequest ${refCode} generated from service listing '${listing.title}'`,
    };
  }
}
