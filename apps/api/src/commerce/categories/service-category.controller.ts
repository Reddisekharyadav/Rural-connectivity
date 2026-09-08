import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ServiceCategoryService } from './service-category.service';

@Controller('service-categories')
export class ServiceCategoryController {
  constructor(private readonly categoryService: ServiceCategoryService) {}

  @Post()
  async createCategory(
    @Body()
    body: {
      name: string;
      description?: string;
      parentId?: string;
    },
  ) {
    return this.categoryService.createCategory(body);
  }

  @Get()
  async listCategories() {
    return this.categoryService.listCategories();
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }
}

