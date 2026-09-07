import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { WorkforceHistoryService } from './work-history.service';

@Controller('workforce/history')
export class WorkforceHistoryController {
  constructor(private readonly historyService: WorkforceHistoryService) {}

  @Get('me')
  async getMyHistory(@Query('workerId') workerId?: string) {
    const activeWorkerId = workerId || 'wp-laxman-004';
    return this.historyService.getWorkerHistory(activeWorkerId);
  }

  @Get('me/earnings')
  async getMyEarningsSummary(@Query('workerId') workerId?: string) {
    const activeWorkerId = workerId || 'wp-laxman-004';
    return this.historyService.getWorkerEarningsSummary(activeWorkerId);
  }

  @Post('record-completion')
  async recordCompletion(
    @Body()
    dto: {
      workerId: string;
      jobAssignmentId: string;
      jobTitle: string;
      organizationName: string;
      startDate: string;
      endDate?: string;
      totalHours?: number;
      totalDays?: number;
      earnings: number;
      rating?: number;
      employerFeedback?: string;
    }
  ) {
    return this.historyService.recordCompletion(dto);
  }
}
