import {
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateCategoryDto,
  EditCategoryDto
} from './dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async createCategory(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: dto.name
      }
    });
  }

  async getCategoryById(categoryId: number) {
    const category =
      await this.prisma.category.findUnique({
        where: { id: categoryId }
      });
    if (!category) {
      throw new NotFoundException(
        `Category with id ${categoryId} not found`
      );
    }
    return category;
  }

  async getAllCategories() {
    return this.prisma.category.findMany();
  }

  async editCategory(
    categoryId: number,
    dto: EditCategoryDto
  ) {
    const category =
      await this.prisma.category.findUnique({
        where: { id: categoryId }
      });
    if (!category) {
      throw new NotFoundException(
        `Category with id ${categoryId} not found`
      );
    }

    return this.prisma.category.update({
      where: { id: categoryId },
      data: {
        ...dto
      }
    });
  }

  async deleteCategory(categoryId: number) {
    const category =
      await this.prisma.category.findUnique({
        where: { id: categoryId }
      });
    if (!category) {
      throw new NotFoundException(
        `Category with id ${categoryId} not found`
      );
    }

    await this.prisma.category.delete({
      where: { id: categoryId }
    });

    return {
      message: 'Category deleted successfully'
    };
  }
}
