import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  EditCategoryDto
} from './dto';
import { Guard } from 'src/auth/guard';
import { Roles } from '../auth/decorator/roles.decorator';

@UseGuards(Guard)
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
  @Roles('ADMIN')
  getCategoryById(@Param('id') id: string) {
    const categoryId = parseInt(id);
    return this.categoryService.getCategoryById(
      categoryId
    );
  }

  @Get()
  @Roles('ADMIN')
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
