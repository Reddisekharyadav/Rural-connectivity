import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { BusinessProductService } from '../business-products/business-product.service';

export type InventoryTransactionType =
  | 'STOCK_IN'
  | 'STOCK_OUT'
  | 'ADJUSTMENT'
  | 'RESERVATION'
  | 'RELEASE'
  | 'RETURN'
  | 'DAMAGED';

export interface InventoryTransaction {
  id: string;
  businessProductId: string;
  type: InventoryTransactionType;
  quantity: number;
  referenceType?: string | null;
  referenceId?: string | null;
  notes?: string | null;
  createdAt: Date;
}

@Injectable()
export class InventoryService {
  private transactions: InventoryTransaction[] = [
    {
      id: 'tx-001',
      businessProductId: 'bp-001',
      type: 'STOCK_IN',
      quantity: 45,
      referenceType: 'INITIAL_STOCK',
      referenceId: 'PO-2026-08',
      notes: 'Initial stock intake from John Deere regional warehouse',
      createdAt: new Date('2026-08-01T10:00:00Z'),
    },
    {
      id: 'tx-002',
      businessProductId: 'bp-002',
      type: 'STOCK_IN',
      quantity: 28,
      referenceType: 'INITIAL_STOCK',
      referenceId: 'PO-2026-09',
      notes: 'Initial stock intake from Finolex distributor',
      createdAt: new Date('2026-08-05T10:00:00Z'),
    },
  ];

  constructor(private readonly businessProductService: BusinessProductService) {}

  async recordTransaction(data: {
    businessProductId: string;
    type: InventoryTransactionType;
    quantity: number;
    referenceType?: string;
    referenceId?: string;
    notes?: string;
  }): Promise<InventoryTransaction> {
    const bp = await this.businessProductService.getBusinessProductById(data.businessProductId);
    if (!bp) {
      throw new NotFoundException(`BusinessProduct with ID '${data.businessProductId}' not found`);
    }

    if (data.quantity === 0) {
      throw new BadRequestException('Transaction quantity cannot be zero');
    }

    let updatedStock = bp.stockQuantity;
    let updatedReserved = bp.reservedQuantity;

    switch (data.type) {
      case 'STOCK_IN':
      case 'RETURN':
        updatedStock += Math.abs(data.quantity);
        break;

      case 'RESERVATION':
        const reserveQty = Math.abs(data.quantity);
        if (bp.stockQuantity - bp.reservedQuantity < reserveQty) {
          throw new BadRequestException(
            `Insufficient available stock for reservation. Available: ${bp.stockQuantity - bp.reservedQuantity}, Requested: ${reserveQty}`,
          );
        }
        updatedReserved += reserveQty;
        break;

      case 'RELEASE':
        const releaseQty = Math.abs(data.quantity);
        updatedReserved = Math.max(0, updatedReserved - releaseQty);
        break;

      case 'STOCK_OUT':
      case 'DAMAGED':
        const outQty = Math.abs(data.quantity);
        if (bp.stockQuantity < outQty) {
          throw new BadRequestException(`Insufficient total stock to deduct ${outQty} units`);
        }
        updatedStock -= outQty;
        updatedReserved = Math.max(0, updatedReserved - outQty);
        break;

      case 'ADJUSTMENT':
        updatedStock = Math.max(0, updatedStock + data.quantity);
        break;
    }

    await this.businessProductService.updatePricingAndStock(bp.id, {
      stockQuantity: updatedStock,
      reservedQuantity: updatedReserved,
    });

    const id = `tx-${Date.now().toString().slice(-6)}`;
    const tx: InventoryTransaction = {
      id,
      businessProductId: data.businessProductId,
      type: data.type,
      quantity: data.quantity,
      referenceType: data.referenceType || null,
      referenceId: data.referenceId || null,
      notes: data.notes || null,
      createdAt: new Date(),
    };

    this.transactions.push(tx);
    return tx;
  }

  async getTransactionsByProduct(businessProductId: string): Promise<InventoryTransaction[]> {
    return this.transactions
      .filter((t) => t.businessProductId === businessProductId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getLowStockAlerts(businessId: string, threshold = 5): Promise<any[]> {
    const products = await this.businessProductService.getBusinessProducts(businessId);
    return products
      .filter((p) => p.stockQuantity <= threshold)
      .map((p) => ({
        businessProductId: p.id,
        productName: p.product?.name || p.productId,
        currentStock: p.stockQuantity,
        reservedStock: p.reservedQuantity,
        availableStock: p.stockQuantity - p.reservedQuantity,
        threshold,
        alertLevel: p.stockQuantity === 0 ? 'CRITICAL_OUT_OF_STOCK' : 'LOW_STOCK',
      }));
  }
}

