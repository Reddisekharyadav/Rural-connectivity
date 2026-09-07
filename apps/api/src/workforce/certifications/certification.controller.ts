import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { WorkforceCertificationService, CertificationDto } from './certification.service';

@Controller('workforce/certifications')
export class WorkforceCertificationController {
  constructor(private readonly certService: WorkforceCertificationService) {}

  @Get('me')
  async getMyCertifications(@Query('workerId') workerId?: string) {
    const activeWorkerId = workerId || 'wp-laxman-004';
    return this.certService.getCertifications(activeWorkerId);
  }

  @Post('me')
  async addCertification(
    @Body() dto: CertificationDto,
    @Query('workerId') workerId?: string
  ) {
    const activeWorkerId = workerId || 'wp-laxman-004';
    return this.certService.addCertification(activeWorkerId, dto);
  }

  @Patch(':id/verify')
  async verifyCertification(
    @Param('id') id: string,
    @Body('status') status: 'VERIFIED' | 'REJECTED' | 'EXPIRED',
    @Query('workerId') workerId?: string
  ) {
    const activeWorkerId = workerId || 'wp-laxman-004';
    return this.certService.verifyCertification(activeWorkerId, id, status);
  }
}

