import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { WorkforceAttendanceService, CheckInDto, CheckOutDto } from './attendance.service';

@Controller('workforce/attendance')
export class WorkforceAttendanceController {
  constructor(private readonly attendanceService: WorkforceAttendanceService) {}

  @Post('check-in')
  async checkIn(
    @Body() dto: CheckInDto,
    @Query('workerId') workerId?: string
  ) {
    const activeWorkerId = workerId || dto.workerId || 'wp-laxman-004';
    return this.attendanceService.checkIn({ ...dto, workerId: activeWorkerId });
  }

  @Post(':id/check-out')
  async checkOut(
    @Param('id') id: string,
    @Body() dto: CheckOutDto
  ) {
    return this.attendanceService.checkOut(id, dto);
  }

  @Get('assignment/:assignmentId')
  async getAssignmentAttendance(@Param('assignmentId') assignmentId: string) {
    return this.attendanceService.getAssignmentAttendance(assignmentId);
  }

  @Get('me')
  async getMyAttendance(@Query('workerId') workerId?: string) {
    const activeWorkerId = workerId || 'wp-laxman-004';
    return this.attendanceService.getWorkerAttendance(activeWorkerId);
  }

  @Post(':id/verify-supervisor')
  async verifyBySupervisor(
    @Param('id') id: string,
    @Body('notes') notes?: string,
    @Query('supervisorId') supervisorId?: string
  ) {
    const activeSupervisorId = supervisorId || 'usr-contractor-003';
    return this.attendanceService.confirmBySupervisor(id, activeSupervisorId, notes);
  }
}

