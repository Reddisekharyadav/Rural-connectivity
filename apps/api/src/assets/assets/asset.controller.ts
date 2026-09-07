import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AssetService, AssetType, CreateAssetDto, UpdateAssetDto } from './asset.service';
import { AssetStatus } from './asset-state-machine';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  async createAsset(@Body() dto: CreateAssetDto) {
    return this.assetService.createAsset(dto);
  }

  @Get()
  async listAssets(
    @Query('ownerId') ownerId?: string,
    @Query('organizationId') organizationId?: string,
    @Query('assetType') assetType?: AssetType,
    @Query('status') status?: AssetStatus,
    @Query('baseLocationId') baseLocationId?: string,
  ) {
    return this.assetService.listAssets({ ownerId, organizationId, assetType, status, baseLocationId });
  }

  @Get(':id')
  async getAssetById(@Param('id') id: string) {
    return this.assetService.getAssetById(id);
  }

  @Patch(':id')
  async updateAsset(@Param('id') id: string, @Body() dto: UpdateAssetDto) {
    return this.assetService.updateAsset(id, dto);
  }

  @Patch(':id/status')
  async updateAssetStatus(@Param('id') id: string, @Body('status') status: AssetStatus) {
    return this.assetService.updateAssetStatus(id, status);
  }

  @Delete(':id')
  async deleteAsset(@Param('id') id: string) {
    return this.assetService.deleteAsset(id);
  }
}

