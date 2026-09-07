import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { WorkforceJobService, CreateJobDto } from './job.service';
import { JobPostingStatus } from './job-state-machine';

@Controller('workforce/jobs')
export class WorkforceJobController {
  constructor(private readonly jobService: WorkforceJobService) {}

  @Post()
  async createJob(
    @Body() dto: CreateJobDto,
    @Query('userId') userId?: string
  ) {
    const activeUserId = userId || 'usr-contractor-003';
    return this.jobService.createJob(activeUserId, dto);
  }

  @Get()
  async getJobs(
    @Query('status') status?: string,
    @Query('jobType') jobType?: string,
    @Query('creatorId') creatorId?: string
  ) {
    return this.jobService.getJobs({ status, jobType, creatorId });
  }

  @Get(':id')
  async getJobById(@Param('id') id: string) {
    return this.jobService.getJobById(id);
  }

  @Patch(':id')
  async updateJob(
    @Param('id') id: string,
    @Body() dto: Partial<CreateJobDto>
  ) {
    return this.jobService.updateJob(id, dto);
  }

  @Post(':id/publish')
  async publishJob(@Param('id') id: string) {
    return this.jobService.publishJob(id);
  }

  @Post(':id/status')
  async updateJobStatus(
    @Param('id') id: string,
    @Body('status') status: JobPostingStatus
  ) {
    return this.jobService.transitionStatus(id, status);
  }

  @Post(':id/close')
  async closeJob(@Param('id') id: string) {
    return this.jobService.closeJob(id);
  }

  @Post(':id/cancel')
  async cancelJob(
    @Param('id') id: string,
    @Body('reason') reason?: string
  ) {
    return this.jobService.cancelJob(id, reason);
  }

  @Post('from-farm-activity')
  async createFromFarmActivity(
    @Body()
    dto: {
      farmActivityId: string;
      farmId: string;
      cropName: string;
      activityTitle: string;
      workersRequired: number;
      scheduledDate: string;
      expectedDailyWage?: number;
    }
  ) {
    return this.jobService.createFromFarmActivity(dto);
  }
}

