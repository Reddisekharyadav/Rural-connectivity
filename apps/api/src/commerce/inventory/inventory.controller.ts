import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { InventoryService, InventoryTransactionType } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('transactions')
  async recordTransaction(
    @Body()
    body: {
      businessProductId: string;
      type: InventoryTransactionType;
      quantity: number;
      referenceType?: string;
      referenceId?: string;
      notes?: string;
    },
  ) {
    return this.inventoryService.recordTransaction(body);
  }

  @Get('transactions/:businessProductId')
  async getTransactions(@Param('businessProductId') businessProductId: string) {
    return this.inventoryService.getTransactionsByProduct(businessProductId);
  }

  @Get('low-stock/:businessId')
  async getLowStockAlerts(
    @Param('businessId') businessId: string,
    @Query('threshold') threshold?: string,
  ) {
    return this.inventoryService.getLowStockAlerts(businessId, threshold ? parseInt(threshold) : 5);
  }
}

