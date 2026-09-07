import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AssetMaintenanceService, CreateMaintenanceDto } from './maintenance.service';

@Controller('maintenance')
export class AssetMaintenanceController {
  constructor(private readonly maintenanceService: AssetMaintenanceService) {}

  @Post()
  async createRecord(@Body() dto: CreateMaintenanceDto) {
    return this.maintenanceService.createRecord(dto);
  }

  @Get('asset/:assetId')
  async getRecordsForAsset(@Param('assetId') assetId: string) {
    return this.maintenanceService.getRecordsForAsset(assetId);
  }

  @Patch(':id')
  async updateRecord(@Param('id') id: string, @Body() dto: Partial<CreateMaintenanceDto>) {
    return this.maintenanceService.updateRecord(id, dto);
  }
}

