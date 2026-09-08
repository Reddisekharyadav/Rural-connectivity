import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import {
  ReconciliationService,
  ExternalGatewayTransaction,
  ReconciliationStatus,
} from './reconciliation.service';

@Controller('finance/reconciliation')
export class ReconciliationController {
  constructor(private readonly recService: ReconciliationService) {}

  @Get()
  async getRecords(@Query('status') status?: ReconciliationStatus) {
    return this.recService.getReconciliationRecords(status);
  }

  @Post('run')
  async runReconciliation(
    @Body()
    body: {
      provider: string;
      externalTransactions: ExternalGatewayTransaction[];
    }
  ) {
    return this.recService.runReconciliation(
      body.provider || 'RAZORPAY',
      body.externalTransactions || []
    );
  }

  @Post(':id/resolve')
  async resolveMismatch(@Param('id') id: string, @Body() body: { notes: string }) {
    return this.recService.resolveMismatch(id, body.notes);
  }
}

