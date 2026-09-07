import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateListingDto, RentalListingService, RentalMode, UpdateListingDto } from './listing.service';

@Controller('rental-listings')
export class RentalListingController {
  constructor(private readonly listingService: RentalListingService) {}

  @Post()
  async createListing(@Body() dto: CreateListingDto) {
    return this.listingService.createListing(dto);
  }

  @Get()
  async listListings(
    @Query('ownerId') ownerId?: string,
    @Query('assetId') assetId?: string,
    @Query('rentalMode') rentalMode?: RentalMode,
    @Query('status') status?: string,
  ) {
    return this.listingService.listListings({ ownerId, assetId, rentalMode, status });
  }

  @Get(':id')
  async getListingById(@Param('id') id: string) {
    return this.listingService.getListingById(id);
  }

  @Patch(':id')
  async updateListing(@Param('id') id: string, @Body() dto: UpdateListingDto) {
    return this.listingService.updateListing(id, dto);
  }

  @Delete(':id')
  async deleteListing(@Param('id') id: string) {
    return this.listingService.deleteListing(id);
  }
}

