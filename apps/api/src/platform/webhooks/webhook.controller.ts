import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('platform/webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('subscriptions')
  async createSubscription(
    @Body()
    body: {
      endpointUrl: string;
      subscribedEvents: string[];
      organizationId?: string;
      userId?: string;
    },
  ) {
    return this.webhookService.createSubscription(body);
  }

  @Get('subscriptions')
  async listSubscriptions(
    @Query('organizationId') organizationId?: string,
    @Query('userId') userId?: string,
  ) {
    return this.webhookService.listSubscriptions({ organizationId, userId });
  }

  @Get('subscriptions/:id/deliveries')
  async listDeliveries(@Param('id') subscriptionId: string) {
    return this.webhookService.listDeliveries(subscriptionId);
  }
}

