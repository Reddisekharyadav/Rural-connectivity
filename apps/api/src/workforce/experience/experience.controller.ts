import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { WorkforceExperienceService, ExperienceDto } from './experience.service';

@Controller('workforce/experience')
export class WorkforceExperienceController {
  constructor(private readonly experienceService: WorkforceExperienceService) {}

  @Get('me')
  async getMyExperience(@Query('workerId') workerId?: string) {
    const activeWorkerId = workerId || 'wp-laxman-004';
    return this.experienceService.getExperience(activeWorkerId);
  }

  @Post('me')
  async addExperience(
    @Body() dto: ExperienceDto,
    @Query('workerId') workerId?: string
  ) {
    const activeWorkerId = workerId || 'wp-laxman-004';
    return this.experienceService.addExperience(activeWorkerId, dto);
  }
}

