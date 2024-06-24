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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth
} from '@nestjs/swagger';

@ApiTags('categories')
@UseFilters(HttpExceptionFilter)
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService
  ) {}

  @Post()
  @UseGuards(Guard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Create a new category'
  })
  @ApiResponse({
    status: 201,
    description:
      'Info about the successfully created category.'
  })
  @ApiBearerAuth()
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoryService.createCategory(
      dto
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a category by ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    type: String
  })
  @ApiResponse({
    status: 200,
    description: 'Category details'
  })
  getCategoryById(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.categoryService.getCategoryById(
      id
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'List of all categories'
  })
  @ApiBearerAuth()
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Patch(':id')
  @UseGuards(Guard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Update a category by ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description:
      'Info about the successfully updated category.'
  })
  @ApiBearerAuth()
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
  @UseGuards(Guard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Delete a category by ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description:
      'Info about the successfully deleted category.'
  })
  @ApiBearerAuth()
  deleteCategory(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.categoryService.deleteCategory(
      id
    );
  }
}
