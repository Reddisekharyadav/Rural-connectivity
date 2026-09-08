import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderStateMachine, CommerceOrderStatus } from './order-state-machine';
import { BusinessService, BusinessProfile } from '../businesses/business.service';
import { BusinessProductService } from '../business-products/business-product.service';
import { InventoryService } from '../inventory/inventory.service';

export type FulfillmentMethod = 'PICKUP' | 'LOCAL_DELIVERY' | 'THIRD_PARTY_LOGISTICS';

export interface CommerceOrderItem {
  id: string;
  orderId: string;
  businessProductId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
}

export interface CommerceOrder {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName?: string;
  sellerBusinessId: string;
  sellerBusiness?: BusinessProfile;
  quoteId?: string | null;
  fulfillmentMethod: FulfillmentMethod;
  deliveryLocationId?: string | null;
  subtotal: number;
  deliveryCost: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  status: CommerceOrderStatus;
  paymentId?: string | null;
  transportBookingId?: string | null;
  items: CommerceOrderItem[];
  orderedAt: Date;
  updatedAt: Date;
}

@Injectable()
export class OrderService {
  private orders = new Map<string, CommerceOrder>([
    [
      'ord-001',
      {
        id: 'ord-001',
        orderNumber: 'ORD-2026-001',
        buyerId: 'usr-ravi-001',
        buyerName: 'Ravi Kumar',
        sellerBusinessId: 'biz-001',
        fulfillmentMethod: 'PICKUP',
        deliveryLocationId: null,
        subtotal: 960.0,
        deliveryCost: 0.0,
        tax: 0.0,
        discount: 0.0,
        total: 960.0,
        currency: 'INR',
        status: 'CONFIRMED',
        paymentId: 'pay-ord-001',
        items: [
          {
            id: 'item-001',
            orderId: 'ord-001',
            businessProductId: 'bp-001',
            productName: 'John Deere Spin-on Engine Oil Filter',
            quantity: 2,
            unit: 'PIECE',
            unitPrice: 480.0,
            totalAmount: 960.0,
          },
        ],
        orderedAt: new Date('2026-09-08T09:30:00Z'),
        updatedAt: new Date('2026-09-08T09:30:00Z'),
      },
    ],
  ]);

  constructor(
    private readonly businessService: BusinessService,
    private readonly businessProductService: BusinessProductService,
    private readonly inventoryService: InventoryService,
  ) {}

  async createOrder(data: {
    buyerId: string;
    buyerName?: string;
    sellerBusinessId: string;
    quoteId?: string;
    fulfillmentMethod?: FulfillmentMethod;
    deliveryLocationId?: string;
    items: Array<{
      businessProductId: string;
      quantity: number;
    }>;
  }): Promise<CommerceOrder> {
    const business = await this.businessService.getBusinessById(data.sellerBusinessId);

    if (!data.items || data.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    let subtotal = 0;
    const orderItems: CommerceOrderItem[] = [];
    const id = `ord-${Date.now().toString().slice(-6)}`;
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    for (const item of data.items) {
      const bp = await this.businessProductService.getBusinessProductById(item.businessProductId);

      if (bp.stockQuantity - bp.reservedQuantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for '${bp.product?.name || bp.productId}'. Available: ${bp.stockQuantity - bp.reservedQuantity}, Requested: ${item.quantity}`,
        );
      }

      const itemTotal = bp.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        id: `item-${Date.now().toString().slice(-6)}-${orderItems.length + 1}`,
        orderId: id,
        businessProductId: bp.id,
        productName: bp.product?.name || bp.sku || 'Product',
        quantity: item.quantity,
        unit: bp.product?.unit || 'PIECE',
        unitPrice: bp.price,
        totalAmount: itemTotal,
      });

      // Reserve stock
      await this.inventoryService.recordTransaction({
        businessProductId: bp.id,
        type: 'RESERVATION',
        quantity: item.quantity,
        referenceType: 'COMMERCE_ORDER',
        referenceId: id,
        notes: `Stock reserved for order ${orderNumber}`,
      });
    }

    const deliveryCost = data.fulfillmentMethod === 'LOCAL_DELIVERY' ? 150.0 : 0.0;
    const total = subtotal + deliveryCost;

    const order: CommerceOrder = {
      id,
      orderNumber,
      buyerId: data.buyerId,
      buyerName: data.buyerName || 'Farmer Buyer',
      sellerBusinessId: data.sellerBusinessId,
      sellerBusiness: business,
      quoteId: data.quoteId || null,
      fulfillmentMethod: data.fulfillmentMethod || 'PICKUP',
      deliveryLocationId: data.deliveryLocationId || null,
      subtotal,
      deliveryCost,
      tax: 0.0,
      discount: 0.0,
      total,
      currency: 'INR',
      status: 'CONFIRMED',
      items: orderItems,
      orderedAt: new Date(),
      updatedAt: new Date(),
    };

    this.orders.set(id, order);
    return order;
  }

  async transitionStatus(orderId: string, nextStatus: CommerceOrderStatus): Promise<CommerceOrder> {
    const order = await this.getOrderById(orderId);

    OrderStateMachine.validateTransition(order.status, nextStatus);

    // If cancelling, release reserved inventory
    if (nextStatus === 'CANCELLED') {
      for (const item of order.items) {
        try {
          await this.inventoryService.recordTransaction({
            businessProductId: item.businessProductId,
            type: 'RELEASE',
            quantity: item.quantity,
            referenceType: 'ORDER_CANCELLED',
            referenceId: order.id,
            notes: `Stock reservation released due to cancellation of order ${order.orderNumber}`,
          });
        } catch {}
      }
    }

    // If completed, deduct stock permanently
    if (nextStatus === 'COMPLETED' && order.status !== 'COMPLETED') {
      for (const item of order.items) {
        try {
          await this.inventoryService.recordTransaction({
            businessProductId: item.businessProductId,
            type: 'STOCK_OUT',
            quantity: item.quantity,
            referenceType: 'ORDER_COMPLETED',
            referenceId: order.id,
            notes: `Stock fulfilled for completed order ${order.orderNumber}`,
          });
        } catch {}
      }
    }

    order.status = nextStatus;
    order.updatedAt = new Date();
    this.orders.set(orderId, order);
    return order;
  }

  async getOrderById(orderId: string): Promise<CommerceOrder> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID '${orderId}' not found`);
    }
    if (!order.sellerBusiness) {
      try {
        order.sellerBusiness = await this.businessService.getBusinessById(order.sellerBusinessId);
      } catch {}
    }
    return order;
  }

  async listOrders(filter?: {
    buyerId?: string;
    sellerBusinessId?: string;
    status?: CommerceOrderStatus;
  }): Promise<CommerceOrder[]> {
    let list = Array.from(this.orders.values());
    if (filter?.buyerId) {
      list = list.filter((o) => o.buyerId === filter.buyerId);
    }
    if (filter?.sellerBusinessId) {
      list = list.filter((o) => o.sellerBusinessId === filter.sellerBusinessId);
    }
    if (filter?.status) {
      list = list.filter((o) => o.status === filter.status);
    }
    return list.sort((a, b) => b.orderedAt.getTime() - a.orderedAt.getTime());
  }
}

