import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { WorkforceSkillService } from './skill.service';

@Controller('workforce/skills')
export class WorkforceSkillController {
  constructor(private readonly skillService: WorkforceSkillService) {}

  @Get('catalog')
  async getCatalog() {
    return this.skillService.getCatalog();
  }

  @Get('me')
  async getMySkills(@Query('workerId') workerId?: string) {
    const activeWorkerId = workerId || 'wp-laxman-004';
    return this.skillService.getWorkerSkills(activeWorkerId);
  }

  @Post('me')
  async addMySkill(
    @Body() dto: { skillCode: string; skillLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'; yearsExperience?: number; isPrimary?: boolean },
    @Query('workerId') workerId?: string
  ) {
    const activeWorkerId = workerId || 'wp-laxman-004';
    return this.skillService.addWorkerSkill(activeWorkerId, dto);
  }

  @Patch('me/:id')
  async updateMySkill(
    @Param('id') id: string,
    @Body() dto: { skillLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'; yearsExperience?: number; isPrimary?: boolean },
    @Query('workerId') workerId?: string
  ) {
    const activeWorkerId = workerId || 'wp-laxman-004';
    return this.skillService.updateWorkerSkill(activeWorkerId, id, dto);
  }

  @Delete('me/:id')
  async deleteMySkill(
    @Param('id') id: string,
    @Query('workerId') workerId?: string
  ) {
    const activeWorkerId = workerId || 'wp-laxman-004';
    return this.skillService.removeWorkerSkill(activeWorkerId, id);
  }
}

