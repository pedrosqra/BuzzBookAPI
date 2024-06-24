import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCategoryDto,
  EditCategoryDto
} from './dto';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryRepository {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async createCategory(
    dto: CreateCategoryDto
  ): Promise<Category> {
    return this.prisma.category.create({
      data: {
        name: dto.name
      }
    });
  }

  async findById(
    categoryId: number
  ): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id: categoryId }
    });
  }

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  async updateCategory(
    categoryId: number,
    dto: EditCategoryDto
  ): Promise<Category> {
    return this.prisma.category.update({
      where: { id: categoryId },
      data: {
        ...dto
      }
    });
  }

  async deleteCategory(
    categoryId: number
  ): Promise<Category> {
    return this.prisma.category.delete({
      where: { id: categoryId }
    });
  }
}
