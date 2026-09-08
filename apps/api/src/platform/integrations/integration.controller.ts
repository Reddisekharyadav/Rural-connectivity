import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { IntegrationType } from './adapters/integration-adapter.interface';

@Controller('platform/integrations')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Post()
  async createIntegration(
    @Body()
    body: {
      name: string;
      type: IntegrationType;
      organizationId?: string;
      configurationReference?: string;
    },
  ) {
    return this.integrationService.createIntegration(body);
  }

  @Get()
  async listIntegrations(@Query('organizationId') organizationId?: string) {
    return this.integrationService.listIntegrations({ organizationId });
  }

  @Get('health')
  async getHealth() {
    return this.integrationService.getHealthStatus();
  }
}
