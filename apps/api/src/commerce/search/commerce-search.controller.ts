import { Controller, Get, Query } from '@nestjs/common';
import { CommerceSearchService } from './commerce-search.service';

@Controller('commerce/search')
export class CommerceSearchController {
  constructor(private readonly searchService: CommerceSearchService) {}

  @Get()
  async search(
    @Query('keyword') keyword?: string,
    @Query('category') category?: string,
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('maxDistanceKm') maxDistanceKm?: string,
    @Query('brand') brand?: string,
    @Query('model') model?: string,
  ) {
    return this.searchService.searchCommerce({
      keyword,
      category,
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
      maxDistanceKm: maxDistanceKm ? parseFloat(maxDistanceKm) : undefined,
      brand,
      model,
    });
  }
}

