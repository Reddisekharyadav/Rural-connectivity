import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AssetSpecificationService, CreateSpecDto } from './specification.service';

@Controller('assets/:assetId/specifications')
export class AssetSpecificationController {
  constructor(private readonly specService: AssetSpecificationService) {}

  @Post()
  async addSpecification(@Param('assetId') assetId: string, @Body() dto: CreateSpecDto) {
    return this.specService.addSpecification(assetId, dto);
  }

  @Get()
  async getSpecifications(@Param('assetId') assetId: string) {
    return this.specService.getSpecifications(assetId);
  }

  @Patch(':specId')
  async updateSpecification(
    @Param('assetId') assetId: string,
    @Param('specId') specId: string,
    @Body() dto: Partial<CreateSpecDto>,
  ) {
    return this.specService.updateSpecification(assetId, specId, dto);
  }

  @Delete(':specId')
  async deleteSpecification(@Param('assetId') assetId: string, @Param('specId') specId: string) {
    return this.specService.deleteSpecification(assetId, specId);
  }
}

