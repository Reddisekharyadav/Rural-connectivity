import { Controller, Get, Post, Param, Body, Query, Patch } from '@nestjs/common';
import { OrderService, FulfillmentMethod } from './order.service';
import { CommerceOrderStatus } from './order-state-machine';

@Controller('commerce-orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Body()
    body: {
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
    },
  ) {
    return this.orderService.createOrder(body);
  }

  @Get()
  async listOrders(
    @Query('buyerId') buyerId?: string,
    @Query('sellerBusinessId') sellerBusinessId?: string,
    @Query('status') status?: CommerceOrderStatus,
  ) {
    return this.orderService.listOrders({ buyerId, sellerBusinessId, status });
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @Patch(':id/status')
  async transitionStatus(
    @Param('id') id: string,
    @Body('status') status: CommerceOrderStatus,
  ) {
    return this.orderService.transitionStatus(id, status);
  }

  @Post(':id/confirm')
  async confirmOrder(@Param('id') id: string) {
    return this.orderService.transitionStatus(id, 'CONFIRMED');
  }

  @Post(':id/ready')
  async markReady(@Param('id') id: string) {
    return this.orderService.transitionStatus(id, 'READY_FOR_PICKUP');
  }

  @Post(':id/complete')
  async completeOrder(@Param('id') id: string) {
    return this.orderService.transitionStatus(id, 'COMPLETED');
  }

  @Post(':id/cancel')
  async cancelOrder(@Param('id') id: string) {
    return this.orderService.transitionStatus(id, 'CANCELLED');
  }
}

