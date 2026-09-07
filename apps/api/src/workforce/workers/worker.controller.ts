import { Controller, Get, Patch, Body, Param, Query } from '@nestjs/common';
import { WorkforceWorkerService, WorkerProfileDto } from './worker.service';

@Controller('workforce/workers')
export class WorkforceWorkerController {
  constructor(private readonly workerService: WorkforceWorkerService) {}

  @Get('me')
  async getMyProfile(@Query('userId') userId?: string) {
    const activeUserId = userId || 'usr-laxman-004';
    return this.workerService.getProfile(activeUserId);
  }

  @Patch('me')
  async updateMyProfile(
    @Body() dto: WorkerProfileDto,
    @Query('userId') userId?: string
  ) {
    const activeUserId = userId || 'usr-laxman-004';
    return this.workerService.updateProfile(activeUserId, dto);
  }

  @Patch('me/availability')
  async updateAvailability(
    @Body('status') status: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE' | 'LOOKING_FOR_WORK',
    @Query('userId') userId?: string
  ) {
    const activeUserId = userId || 'usr-laxman-004';
    return this.workerService.updateAvailability(activeUserId, status);
  }

  @Get()
  async getAllWorkers() {
    return this.workerService.getAllWorkers();
  }

  @Get(':id')
  async getWorkerById(@Param('id') id: string) {
    return this.workerService.getWorkerById(id);
  }
}

