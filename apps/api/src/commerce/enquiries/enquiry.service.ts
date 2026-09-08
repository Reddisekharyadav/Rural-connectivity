import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BusinessService } from '../businesses/business.service';

export type EnquiryStatus = 'OPEN' | 'QUOTED' | 'RESOLVED' | 'CLOSED';

export interface ProductEnquiry {
  id: string;
  businessId: string;
  buyerId: string;
  buyerName?: string;
  productId?: string | null;
  productName?: string | null;
  message: string;
  quantity: number;
  status: EnquiryStatus;
  createdAt: Date;
}

@Injectable()
export class EnquiryService {
  private enquiries = new Map<string, ProductEnquiry>([
    [
      'enq-001',
      {
        id: 'enq-001',
        businessId: 'biz-001',
        buyerId: 'usr-ravi-001',
        buyerName: 'Ravi Kumar (Cotton Farmer)',
        productId: 'prod-002',
        productName: 'Finolex 3-inch Flexible Agricultural Delivery Pipe (100ft)',
        message: 'Do you have 200 meters of 3-inch delivery hose and brass couplings in stock for immediate delivery?',
        quantity: 2,
        status: 'OPEN',
        createdAt: new Date('2026-09-08T08:00:00Z'),
      },
    ],
  ]);

  constructor(private readonly businessService: BusinessService) {}

  async createEnquiry(data: {
    businessId: string;
    buyerId: string;
    buyerName?: string;
    productId?: string;
    productName?: string;
    message: string;
    quantity?: number;
  }): Promise<ProductEnquiry> {
    await this.businessService.getBusinessById(data.businessId);

    if (!data.message || !data.buyerId) {
      throw new BadRequestException('Enquiry message and buyerId are required');
    }

    const id = `enq-${Date.now().toString().slice(-6)}`;
    const enquiry: ProductEnquiry = {
      id,
      businessId: data.businessId,
      buyerId: data.buyerId,
      buyerName: data.buyerName || 'Farmer Buyer',
      productId: data.productId || null,
      productName: data.productName || null,
      message: data.message,
      quantity: data.quantity || 1,
      status: 'OPEN',
      createdAt: new Date(),
    };

    this.enquiries.set(id, enquiry);
    return enquiry;
  }

  async getEnquiryById(id: string): Promise<ProductEnquiry> {
    const enq = this.enquiries.get(id);
    if (!enq) {
      throw new NotFoundException(`Enquiry with ID '${id}' not found`);
    }
    return enq;
  }

  async updateStatus(id: string, status: EnquiryStatus): Promise<ProductEnquiry> {
    const enq = await this.getEnquiryById(id);
    enq.status = status;
    this.enquiries.set(id, enq);
    return enq;
  }

  async getEnquiriesByBusiness(businessId: string): Promise<ProductEnquiry[]> {
    const list: ProductEnquiry[] = [];
    for (const e of this.enquiries.values()) {
      if (e.businessId === businessId) {
        list.push(e);
      }
    }
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getEnquiriesByBuyer(buyerId: string): Promise<ProductEnquiry[]> {
    const list: ProductEnquiry[] = [];
    for (const e of this.enquiries.values()) {
      if (e.buyerId === buyerId) {
        list.push(e);
      }
    }
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

