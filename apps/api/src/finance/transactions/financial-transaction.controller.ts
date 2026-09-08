import { Controller, Get, Param, Query } from '@nestjs/common';
import { FinancialTransactionService } from './financial-transaction.service';
import {
  FinancialCategory,
  FinancialTransactionType,
  FinancialTransactionStatus,
} from '../ledger/ledger.service';

@Controller('financial/transactions')
export class FinancialTransactionController {
  constructor(private readonly txService: FinancialTransactionService) {}

  @Get()
  async getTransactions(
    @Query('userId') userId?: string,
    @Query('type') type?: FinancialTransactionType,
    @Query('status') status?: FinancialTransactionStatus,
    @Query('category') category?: FinancialCategory,
    @Query('referenceType') referenceType?: string,
    @Query('limit') limit?: string
  ) {
    return this.txService.getTransactions({
      userId,
      type,
      status,
      category,
      referenceType,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.txService.getTransactionById(id);
  }
}
