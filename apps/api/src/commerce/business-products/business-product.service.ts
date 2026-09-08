import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BusinessService } from '../businesses/business.service';
import { CommerceProductService, CommerceProduct } from '../products/commerce-product.service';

export interface BusinessProduct {
  id: string;
  businessId: string;
  businessLocationId?: string | null;
  productId: string;
  product?: CommerceProduct;
  sku?: string | null;
  price: number;
  currency: string;
  stockQuantity: number;
  reservedQuantity: number;
  minimumOrderQuantity: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class BusinessProductService {
  private businessProducts = new Map<string, BusinessProduct>([
    [
      'bp-001',
      {
        id: 'bp-001',
        businessId: 'biz-001',
        businessLocationId: 'bloc-001',
        productId: 'prod-001',
        sku: 'JD-FLT-5310',
        price: 480.0,
        currency: 'INR',
        stockQuantity: 45,
        reservedQuantity: 0,
        minimumOrderQuantity: 1,
        status: 'ACTIVE',
        createdAt: new Date('2026-08-01T10:00:00Z'),
        updatedAt: new Date('2026-08-01T10:00:00Z'),
      },
    ],
    [
      'bp-002',
      {
        id: 'bp-002',
        businessId: 'biz-001',
        businessLocationId: 'bloc-001',
        productId: 'prod-002',
        sku: 'FIN-PIPE-3IN',
        price: 2400.0,
        currency: 'INR',
        stockQuantity: 28,
        reservedQuantity: 0,
        minimumOrderQuantity: 1,
        status: 'ACTIVE',
        createdAt: new Date('2026-08-05T10:00:00Z'),
        updatedAt: new Date('2026-08-05T10:00:00Z'),
      },
    ],
    [
      'bp-003',
      {
        id: 'bp-003',
        businessId: 'biz-001',
        businessLocationId: 'bloc-001',
        productId: 'prod-003',
        sku: 'ASP-BOM-12',
        price: 3200.0,
        currency: 'INR',
        stockQuantity: 14,
        reservedQuantity: 0,
        minimumOrderQuantity: 1,
        status: 'ACTIVE',
        createdAt: new Date('2026-08-10T10:00:00Z'),
        updatedAt: new Date('2026-08-10T10:00:00Z'),
      },
    ],
    [
      'bp-004',
      {
        id: 'bp-004',
        businessId: 'biz-003',
        businessLocationId: null,
        productId: 'prod-004',
        sku: 'HAV-CP-750',
        price: 5600.0,
        currency: 'INR',
        stockQuantity: 12,
        reservedQuantity: 0,
        minimumOrderQuantity: 1,
        status: 'ACTIVE',
        createdAt: new Date('2026-08-15T10:00:00Z'),
        updatedAt: new Date('2026-08-15T10:00:00Z'),
      },
    ],
  ]);

  constructor(
    private readonly businessService: BusinessService,
    private readonly productService: CommerceProductService,
  ) {}

  async createBusinessProduct(
    businessId: string,
    data: {
      productId: string;
      businessLocationId?: string;
      price: number;
      currency?: string;
      stockQuantity?: number;
      minimumOrderQuantity?: number;
      sku?: string;
    },
  ): Promise<BusinessProduct> {
    await this.businessService.getBusinessById(businessId);
    const product = await this.productService.getProductById(data.productId);

    if (data.price <= 0) {
      throw new BadRequestException('Price must be greater than zero');
    }

    const id = `bp-${Date.now().toString().slice(-6)}`;
    const bp: BusinessProduct = {
      id,
      businessId,
      productId: data.productId,
      businessLocationId: data.businessLocationId || null,
      price: data.price,
      currency: data.currency || 'INR',
      stockQuantity: data.stockQuantity || 0,
      reservedQuantity: 0,
      minimumOrderQuantity: data.minimumOrderQuantity || 1,
      sku: data.sku || product.sku,
      status: 'ACTIVE',
      product,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.businessProducts.set(id, bp);
    return bp;
  }

  async getBusinessProductById(id: string): Promise<BusinessProduct> {
    const bp = this.businessProducts.get(id);
    if (!bp) {
      throw new NotFoundException(`BusinessProduct with ID '${id}' not found`);
    }
    if (!bp.product) {
      try {
        bp.product = await this.productService.getProductById(bp.productId);
      } catch {}
    }
    return bp;
  }

  async getBusinessProducts(businessId: string): Promise<BusinessProduct[]> {
    const list: BusinessProduct[] = [];
    for (const bp of this.businessProducts.values()) {
      if (bp.businessId === businessId && bp.status === 'ACTIVE') {
        if (!bp.product) {
          try {
            bp.product = await this.productService.getProductById(bp.productId);
          } catch {}
        }
        list.push(bp);
      }
    }
    return list;
  }

  async listAllActive(): Promise<BusinessProduct[]> {
    const list: BusinessProduct[] = [];
    for (const bp of this.businessProducts.values()) {
      if (bp.status === 'ACTIVE') {
        if (!bp.product) {
          try {
            bp.product = await this.productService.getProductById(bp.productId);
          } catch {}
        }
        list.push(bp);
      }
    }
    return list;
  }

  async updatePricingAndStock(
    id: string,
    data: {
      price?: number;
      stockQuantity?: number;
      reservedQuantity?: number;
      minimumOrderQuantity?: number;
    },
  ): Promise<BusinessProduct> {
    const bp = await this.getBusinessProductById(id);
    if (data.price !== undefined) bp.price = data.price;
    if (data.stockQuantity !== undefined) bp.stockQuantity = data.stockQuantity;
    if (data.reservedQuantity !== undefined) bp.reservedQuantity = data.reservedQuantity;
    if (data.minimumOrderQuantity !== undefined) bp.minimumOrderQuantity = data.minimumOrderQuantity;
    bp.updatedAt = new Date();
    this.businessProducts.set(id, bp);
    return bp;
  }
}

