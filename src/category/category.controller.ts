import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  EditCategoryDto
} from './dto';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService
  ) {}

  @Post()
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
  deleteCategory(@Param('id') id: string) {
    const categoryId = parseInt(id);
    return this.categoryService.deleteCategory(
      categoryId
    );
  }
}
