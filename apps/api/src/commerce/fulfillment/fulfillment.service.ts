import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderService } from '../orders/order.service';

@Injectable()
export class FulfillmentService {
  constructor(private readonly orderService: OrderService) {}

  async confirmPickup(orderId: string, receivedByOtp?: string): Promise<any> {
    const order = await this.orderService.getOrderById(orderId);

    if (order.fulfillmentMethod !== 'PICKUP') {
      throw new BadRequestException(`Order ${order.orderNumber} is configured for ${order.fulfillmentMethod}, not PICKUP`);
    }

    const updated = await this.orderService.transitionStatus(orderId, 'COMPLETED');
    return {
      success: true,
      message: `Order ${order.orderNumber} picked up successfully by buyer ${order.buyerName || order.buyerId}`,
      order: updated,
    };
  }

  async dispatchLogisticsDelivery(
    orderId: string,
    data: {
      pickupLocationId: string;
      deliveryLocationId: string;
      requiredVehicleType?: string;
    },
  ): Promise<any> {
    const order = await this.orderService.getOrderById(orderId);
    const transportReqCode = `TRQ-COM-${Date.now().toString().slice(-6)}`;

    const updated = await this.orderService.transitionStatus(orderId, 'OUT_FOR_DELIVERY');
    updated.transportBookingId = `trb-${Date.now().toString().slice(-6)}`;

    return {
      success: true,
      message: `Order ${order.orderNumber} dispatched for farm delivery via TransportRequest ${transportReqCode}`,
      transportRequestId: `trq-${Date.now().toString().slice(-6)}`,
      transportRequestCode: transportReqCode,
      orderStatus: 'OUT_FOR_DELIVERY',
      order: updated,
    };
  }
}

