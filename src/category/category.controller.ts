import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  UseFilters,
  ParseIntPipe
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
  getCategoryById(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.categoryService.getCategoryById(
      id
    );
  }

  @Get()
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Patch(':id')
  @Roles('ADMIN')
  editCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditCategoryDto
  ) {
    return this.categoryService.editCategory(
      id,
      dto
    );
  }

  @Delete(':id')
  @Roles('ADMIN')
  deleteCategory(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.categoryService.deleteCategory(
      id
    );
  }
}
