import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { WorkforceApplicationService, ApplyJobDto } from './application.service';

@Controller('workforce/applications')
export class WorkforceApplicationController {
  constructor(private readonly appService: WorkforceApplicationService) {}

  @Post('jobs/:jobId')
  async applyForJob(
    @Param('jobId') jobId: string,
    @Body() dto: ApplyJobDto,
    @Query('workerId') workerId?: string
  ) {
    const activeWorkerId = workerId || 'wp-laxman-004';
    return this.appService.applyForJob(activeWorkerId, jobId, dto);
  }

  @Get('jobs/:jobId')
  async getJobApplications(@Param('jobId') jobId: string) {
    return this.appService.getJobApplications(jobId);
  }

  @Get('me')
  async getMyApplications(@Query('workerId') workerId?: string) {
    const activeWorkerId = workerId || 'wp-laxman-004';
    return this.appService.getMyApplications(activeWorkerId);
  }

  @Post(':id/shortlist')
  async shortlistApplication(@Param('id') id: string) {
    return this.appService.shortlistApplication(id);
  }

  @Post(':id/reject')
  async rejectApplication(
    @Param('id') id: string,
    @Body('reason') reason?: string
  ) {
    return this.appService.rejectApplication(id, reason);
  }

  @Post(':id/withdraw')
  async withdrawApplication(
    @Param('id') id: string,
    @Query('workerId') workerId?: string
  ) {
    const activeWorkerId = workerId || 'wp-laxman-004';
    return this.appService.withdrawApplication(id, activeWorkerId);
  }
}

