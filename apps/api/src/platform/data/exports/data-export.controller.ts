import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { DataExportService, ExportType, ExportFormat } from './data-export.service';

@Controller('platform/data/exports')
export class DataExportController {
  constructor(private readonly exportService: DataExportService) {}

  @Post('jobs')
  async createExportJob(
    @Body()
    body: {
      requestedById: string;
      organizationId?: string;
      type: ExportType;
      format: ExportFormat;
      filters?: any;
    },
  ) {
    return this.exportService.createExportJob(body);
  }

  @Get('jobs')
  async listExportJobs(
    @Query('requestedById') requestedById?: string,
    @Query('organizationId') organizationId?: string,
  ) {
    return this.exportService.listExportJobs({ requestedById, organizationId });
  }
}
