import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AssetInspectionService, CreateInspectionDto } from './inspection.service';

@Controller('asset-inspections')
export class AssetInspectionController {
  constructor(private readonly inspectionService: AssetInspectionService) {}

  @Post()
  async createInspection(@Body() dto: CreateInspectionDto) {
    return this.inspectionService.createInspection(dto);
  }

  @Get('asset/:assetId')
  async getInspectionsForAsset(@Param('assetId') assetId: string) {
    return this.inspectionService.getInspectionsForAsset(assetId);
  }

  @Get('booking/:bookingId')
  async getInspectionsForBooking(@Param('bookingId') bookingId: string) {
    return this.inspectionService.getInspectionsForBooking(bookingId);
  }
}

