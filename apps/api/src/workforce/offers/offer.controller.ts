import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { WorkforceOfferService, CreateOfferDto } from './offer.service';

@Controller('workforce/offers')
export class WorkforceOfferController {
  constructor(private readonly offerService: WorkforceOfferService) {}

  @Post()
  async createOffer(
    @Body() dto: CreateOfferDto,
    @Query('employerId') employerId?: string
  ) {
    const activeEmployerId = employerId || 'usr-contractor-003';
    return this.offerService.createOffer(activeEmployerId, dto);
  }

  @Get('me')
  async getMyOffers(@Query('workerId') workerId?: string) {
    const activeWorkerId = workerId || 'wp-laxman-004';
    return this.offerService.getMyOffers(activeWorkerId);
  }

  @Get('jobs/:jobId')
  async getOffersByJob(@Param('jobId') jobId: string) {
    return this.offerService.getOffersByJob(jobId);
  }

  @Post(':id/accept')
  async acceptOffer(
    @Param('id') id: string,
    @Query('workerId') workerId?: string
  ) {
    const activeWorkerId = workerId || 'wp-laxman-004';
    return this.offerService.acceptOffer(id, activeWorkerId);
  }

  @Post(':id/decline')
  async declineOffer(
    @Param('id') id: string,
    @Body('reason') reason?: string,
    @Query('workerId') workerId?: string
  ) {
    const activeWorkerId = workerId || 'wp-laxman-004';
    return this.offerService.declineOffer(id, activeWorkerId, reason);
  }
}
