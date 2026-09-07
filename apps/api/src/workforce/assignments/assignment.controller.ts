import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { WorkforceAssignmentService, CreateAssignmentDto } from './assignment.service';

@Controller('workforce/assignments')
export class WorkforceAssignmentController {
  constructor(private readonly assignmentService: WorkforceAssignmentService) {}

  @Post()
  async createAssignment(@Body() dto: CreateAssignmentDto) {
    return this.assignmentService.createAssignment(dto);
  }

  @Get('me')
  async getMyAssignments(@Query('workerId') workerId?: string) {
    const activeWorkerId = workerId || 'wp-laxman-004';
    return this.assignmentService.getMyAssignments(activeWorkerId);
  }

  @Get('jobs/:jobId')
  async getAssignmentsByJob(@Param('jobId') jobId: string) {
    return this.assignmentService.getAssignmentsByJob(jobId);
  }

  @Get(':id')
  async getAssignmentById(@Param('id') id: string) {
    return this.assignmentService.getAssignmentById(id);
  }

  @Post(':id/confirm')
  async confirmAssignment(@Param('id') id: string) {
    return this.assignmentService.confirmAssignment(id);
  }

  @Post(':id/activate')
  async activateAssignment(@Param('id') id: string) {
    return this.assignmentService.activateAssignment(id);
  }

  @Post(':id/complete')
  async completeAssignment(@Param('id') id: string) {
    return this.assignmentService.completeAssignment(id);
  }

  @Post(':id/cancel')
  async cancelAssignment(
    @Param('id') id: string,
    @Body('reason') reason?: string
  ) {
    return this.assignmentService.cancelAssignment(id, reason);
  }
}

