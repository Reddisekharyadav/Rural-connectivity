import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { QuoteService } from './quote.service';

@Controller('commerce-quotes')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Post()
  async createQuote(
    @Body()
    body: {
      enquiryId?: string;
      businessId: string;
      buyerId: string;
      buyerName?: string;
      subtotal: number;
      deliveryCost?: number;
      tax?: number;
      discount?: number;
      validDays?: number;
      notes?: string;
    },
  ) {
    return this.quoteService.createQuote(body);
  }

  @Get(':id')
  async getQuoteById(@Param('id') id: string) {
    return this.quoteService.getQuoteById(id);
  }

  @Post(':id/counter')
  async counterQuote(
    @Param('id') id: string,
    @Body() body: { counterAmount: number; notes?: string },
  ) {
    return this.quoteService.counterQuote(id, body);
  }

  @Post(':id/accept')
  async acceptQuote(@Param('id') id: string) {
    return this.quoteService.acceptQuote(id);
  }

  @Post(':id/reject')
  async rejectQuote(
    @Param('id') id: string,
    @Body('reason') reason?: string,
  ) {
    return this.quoteService.rejectQuote(id, reason);
  }
}

