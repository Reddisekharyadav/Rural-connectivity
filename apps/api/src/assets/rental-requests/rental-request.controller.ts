import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateRentalRequestDto, RentalRequestService, RentalRequestStatus } from './rental-request.service';
import { AssetMatchingService, AssetSearchCriteria } from '../matching/asset-matching.service';
import { AssetType } from '../assets/asset.service';

@Controller()
export class RentalRequestController {
  constructor(
    private readonly requestService: RentalRequestService,
    private readonly matchingService: AssetMatchingService,
  ) {}

  @Get('assets/search')
  async searchAssets(@Query() criteria: AssetSearchCriteria) {
    return this.matchingService.searchAssets(criteria);
  }

  @Post('rental-requests')
  async createRentalRequest(@Body() dto: CreateRentalRequestDto) {
    return this.requestService.createRentalRequest(dto);
  }

  @Get('rental-requests')
  async listRentalRequests(
    @Query('createdById') createdById?: string,
    @Query('assetType') assetType?: AssetType,
    @Query('status') status?: RentalRequestStatus,
  ) {
    return this.requestService.listRentalRequests({ createdById, assetType, status });
  }

  @Get('rental-requests/:id')
  async getRentalRequestById(@Param('id') id: string) {
    return this.requestService.getRentalRequestById(id);
  }

  @Get('rental-requests/:id/matches')
  async findMatchesForRequest(@Param('id') id: string) {
    return this.requestService.findMatchesForRequest(id);
  }

  @Patch('rental-requests/:id/cancel')
  async cancelRentalRequest(@Param('id') id: string) {
    return this.requestService.cancelRentalRequest(id);
  }
}

