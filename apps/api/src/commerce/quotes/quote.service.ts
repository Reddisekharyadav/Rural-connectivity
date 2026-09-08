import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BusinessService } from '../businesses/business.service';
import { EnquiryService } from '../enquiries/enquiry.service';

export type CommerceQuoteStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'COUNTERED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'WITHDRAWN';

export interface CommerceQuote {
  id: string;
  enquiryId?: string | null;
  businessId: string;
  businessName?: string;
  buyerId: string;
  buyerName?: string;
  subtotal: number;
  deliveryCost: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  validUntil: Date;
  status: CommerceQuoteStatus;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class QuoteService {
  private quotes = new Map<string, CommerceQuote>([
    [
      'qte-001',
      {
        id: 'qte-001',
        enquiryId: 'enq-001',
        businessId: 'biz-001',
        businessName: 'Sri Sai Agro Machinery & Spare Parts',
        buyerId: 'usr-ravi-001',
        buyerName: 'Ravi Kumar',
        subtotal: 4800.0,
        deliveryCost: 200.0,
        tax: 0.0,
        discount: 200.0,
        total: 4800.0,
        currency: 'INR',
        validUntil: new Date('2026-09-18T10:00:00Z'),
        status: 'SUBMITTED',
        notes: 'Quote for 2 rolls of 100ft Finolex 3-inch delivery hose including 4 MS brass hose clamps and farm delivery',
        createdAt: new Date('2026-09-08T09:00:00Z'),
        updatedAt: new Date('2026-09-08T09:00:00Z'),
      },
    ],
  ]);

  constructor(
    private readonly businessService: BusinessService,
    private readonly enquiryService: EnquiryService,
  ) {}

  async createQuote(data: {
    enquiryId?: string;
    businessId: string;
    buyerId: string;
    buyerName?: string;
    subtotal: number;
    deliveryCost?: number;
    tax?: number;
    discount?: number;
    validDays?: number;
    notes?: string;
  }): Promise<CommerceQuote> {
    const business = await this.businessService.getBusinessById(data.businessId);

    if (data.subtotal <= 0) {
      throw new BadRequestException('Subtotal must be greater than zero');
    }

    const subtotal = data.subtotal;
    const deliveryCost = data.deliveryCost || 0;
    const tax = data.tax || 0;
    const discount = data.discount || 0;
    const total = subtotal + deliveryCost + tax - discount;

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + (data.validDays || 7));

    const id = `qte-${Date.now().toString().slice(-6)}`;
    const quote: CommerceQuote = {
      id,
      enquiryId: data.enquiryId || null,
      businessId: data.businessId,
      businessName: business.businessName,
      buyerId: data.buyerId,
      buyerName: data.buyerName || 'Buyer',
      subtotal,
      deliveryCost,
      tax,
      discount,
      total,
      currency: 'INR',
      validUntil,
      status: 'SUBMITTED',
      notes: data.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.quotes.set(id, quote);

    if (data.enquiryId) {
      try {
        await this.enquiryService.updateStatus(data.enquiryId, 'QUOTED');
      } catch {}
    }

    return quote;
  }

  async getQuoteById(id: string): Promise<CommerceQuote> {
    const q = this.quotes.get(id);
    if (!q) {
      throw new NotFoundException(`Quote with ID '${id}' not found`);
    }
    return q;
  }

  async counterQuote(
    quoteId: string,
    data: {
      counterAmount: number;
      notes?: string;
    },
  ): Promise<CommerceQuote> {
    const quote = await this.getQuoteById(quoteId);
    if (quote.status !== 'SUBMITTED' && quote.status !== 'COUNTERED') {
      throw new BadRequestException(`Cannot counter quote in status '${quote.status}'`);
    }

    quote.total = data.counterAmount;
    quote.subtotal = data.counterAmount;
    quote.status = 'COUNTERED';
    quote.notes = data.notes ? `${quote.notes || ''} [Counter: ${data.notes}]` : quote.notes;
    quote.updatedAt = new Date();

    this.quotes.set(quoteId, quote);
    return quote;
  }

  async acceptQuote(quoteId: string): Promise<CommerceQuote> {
    const quote = await this.getQuoteById(quoteId);

    if (quote.status === 'ACCEPTED') {
      return quote;
    }

    if (quote.status === 'REJECTED' || quote.status === 'EXPIRED') {
      throw new BadRequestException(`Cannot accept quote in status '${quote.status}'`);
    }

    quote.status = 'ACCEPTED';
    quote.updatedAt = new Date();
    this.quotes.set(quoteId, quote);

    if (quote.enquiryId) {
      try {
        await this.enquiryService.updateStatus(quote.enquiryId, 'RESOLVED');
      } catch {}
    }

    return quote;
  }

  async rejectQuote(quoteId: string, reason?: string): Promise<CommerceQuote> {
    const quote = await this.getQuoteById(quoteId);
    quote.status = 'REJECTED';
    if (reason) quote.notes = `${quote.notes || ''} [Rejected: ${reason}]`;
    quote.updatedAt = new Date();
    this.quotes.set(quoteId, quote);
    return quote;
  }
}

