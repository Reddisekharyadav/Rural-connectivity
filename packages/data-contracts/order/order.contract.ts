export interface OrderItemV1 {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderCreatedV1 {
  orderId: string;
  buyerId: string;
  merchantId: string;
  items: OrderItemV1[];
  totalAmount: number;
  fulfillmentMethod: 'PICKUP' | 'LOCAL_DELIVERY' | 'LOGISTICS_PARTNER';
  deliveryAddress?: string;
  createdAt: string;
}

export interface OrderConfirmedV1 {
  orderId: string;
  merchantId: string;
  confirmedAt: string;
  estimatedDeliveryDate?: string;
}

export interface OrderDeliveredV1 {
  orderId: string;
  deliveredAt: string;
  deliveryProofUrl?: string;
  receiverName?: string;
}
