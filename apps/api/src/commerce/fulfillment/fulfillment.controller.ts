import { Controller, Post, Param, Body } from '@nestjs/common';
import { FulfillmentService } from './fulfillment.service';

@Controller('commerce-orders/:orderId/fulfillment')
export class FulfillmentController {
  constructor(private readonly fulfillmentService: FulfillmentService) {}

  @Post('pickup')
  async confirmPickup(
    @Param('orderId') orderId: string,
    @Body('otp') otp?: string,
  ) {
    return this.fulfillmentService.confirmPickup(orderId, otp);
  }

  @Post('dispatch-logistics')
  async dispatchLogistics(
    @Param('orderId') orderId: string,
    @Body()
    body: {
      pickupLocationId: string;
      deliveryLocationId: string;
      requiredVehicleType?: string;
    },
  ) {
    return this.fulfillmentService.dispatchLogisticsDelivery(orderId, body);
  }
}

