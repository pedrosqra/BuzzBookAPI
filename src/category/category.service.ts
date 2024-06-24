import {
  HttpStatus,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
  BadRequestException
} from '@nestjs/common';
import {
  CreateCategoryDto,
  EditCategoryDto
} from './dto';
import { buildResponse } from '../util/response.util';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(
    CategoryService.name
  );

  constructor(
    private readonly categoryRepository: CategoryRepository
  ) {}

  async createCategory(dto: CreateCategoryDto) {
    try {
      const category =
        await this.categoryRepository.createCategory(
          dto
        );
      return buildResponse(
        HttpStatus.CREATED,
        'Category created successfully',
        category
      );
    } catch (error) {
      this.logger.error(
        'Error creating category:',
        error
      );
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Category name must be unique'
        );
      } else {
        throw new InternalServerErrorException(
          'Failed to create category'
        );
      }
    }
  }

  async getCategoryById(categoryId: number) {
    try {
      const category =
        await this.categoryRepository.findById(
          categoryId
        );
      if (!category) {
        throw new NotFoundException(
          'Category not found'
        );
      }
      return buildResponse(
        HttpStatus.OK,
        `Category retrieved successfully`,
        category
      );
    } catch (error) {
      this.logger.error(
        'Error getting category by ID:',
        error
      );
      throw error;
    }
  }

  async getAllCategories() {
    try {
      const categories =
        await this.categoryRepository.findAll();
      if (!categories) {
        throw new InternalServerErrorException();
      }
      return buildResponse(
        HttpStatus.OK,
        'Categories listed successfully',
        categories
      );
    } catch (error) {
      this.logger.error(
        'Error getting all categories:',
        error
      );
      throw new InternalServerErrorException(
        'Failed to fetch categories'
      );
    }
  }

  async editCategory(
    categoryId: number,
    dto: EditCategoryDto
  ) {
    try {
      const existingCategory =
        await this.categoryRepository.findById(
          categoryId
        );
      if (!existingCategory) {
        throw new NotFoundException(
          'Category not found'
        );
      }

      const updatedCategory =
        await this.categoryRepository.updateCategory(
          categoryId,
          dto
        );
      return buildResponse(
        HttpStatus.OK,
        'Category updated successfully',
        updatedCategory
      );
    } catch (error) {
      this.logger.error(
        'Error editing category:',
        error
      );
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Category name must be unique'
        );
      } else {
        throw new InternalServerErrorException(
          'Failed to update category'
        );
      }
    }
  }

  async deleteCategory(categoryId: number) {
    try {
      const existingCategory =
        await this.categoryRepository.findById(
          categoryId
        );
      if (!existingCategory) {
        throw new NotFoundException(
          'Category not found'
        );
      }

      const deletedCategory =
        await this.categoryRepository.deleteCategory(
          categoryId
        );
      return buildResponse(
        HttpStatus.OK,
        'Category deleted successfully',
        deletedCategory
      );
    } catch (error) {
      this.logger.error(
        'Error deleting category:',
        error
      );
      throw new InternalServerErrorException(
        'Failed to delete category'
      );
    }
  }
}
