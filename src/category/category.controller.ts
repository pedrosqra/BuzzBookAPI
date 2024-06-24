import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  UseFilters
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  EditCategoryDto
} from './dto';
import { Guard } from '../auth/guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { HttpExceptionFilter } from '../exceptions/http-exception.filter';

@UseGuards(Guard)
@UseFilters(HttpExceptionFilter)
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService
  ) {}

  @Post()
  @Roles('ADMIN')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoryService.createCategory(
      dto
    );
  }

  @Get(':id')
  getCategoryById(@Param('id') id: string) {
    const categoryId = parseInt(id);
    return this.categoryService.getCategoryById(
      categoryId
    );
  }

  @Get()
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Patch(':id')
  @Roles('ADMIN')
  editCategory(
    @Param('id') id: string,
    @Body() dto: EditCategoryDto
  ) {
    const categoryId = parseInt(id);
    return this.categoryService.editCategory(
      categoryId,
      dto
    );
  }

  @Delete(':id')
  @Roles('ADMIN')
  deleteCategory(@Param('id') id: string) {
    const categoryId = parseInt(id);
    return this.categoryService.deleteCategory(
      categoryId
    );
  }
}
