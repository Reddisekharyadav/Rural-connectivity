import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { CommerceProductService, CommerceProductCategory } from './commerce-product.service';

@Controller('commerce-products')
export class CommerceProductController {
  constructor(private readonly productService: CommerceProductService) {}

  @Post()
  async createProduct(
    @Body()
    body: {
      name: string;
      description?: string;
      category?: CommerceProductCategory;
      brand?: string;
      model?: string;
      sku?: string;
      unit?: string;
    },
  ) {
    return this.productService.createProduct(body);
  }

  @Get()
  async listProducts(
    @Query('category') category?: CommerceProductCategory,
    @Query('brand') brand?: string,
    @Query('search') search?: string,
  ) {
    return this.productService.listProducts({ category, brand, search });
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }
}
