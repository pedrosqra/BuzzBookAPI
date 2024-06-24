import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Book } from '@prisma/client';
import {
  CreateBookDto,
  EditBookDto
} from '../book/dto';

@Injectable()
export class BookRepository {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async createBook(
    dto: CreateBookDto
  ): Promise<Book> {
    const {
      title,
      author,
      description,
      price,
      quantity,
      categoryId
    } = dto;
    return this.prisma.book.create({
      data: {
        title,
        author,
        description,
        price,
        bookQuantity: quantity,
        categoryId
      }
    });
  }

  async findAll(): Promise<Book[]> {
    return this.prisma.book.findMany();
  }

  async findById(
    id: number
  ): Promise<Book | null> {
    return this.prisma.book.findUnique({
      where: { id }
    });
  }

  async findByTitle(
    title: string
  ): Promise<Book[]> {
    return this.prisma.book.findMany({
      where: {
        title: {
          contains: title,
          mode: 'insensitive'
        }
      }
    });
  }

  async findByCategory(
    categoryId: number
  ): Promise<Book[]> {
    return this.prisma.book.findMany({
      where: { categoryId }
    });
  }

  async updateBook(
    id: number,
    dto: EditBookDto
  ): Promise<Book> {
    return await this.prisma.book.update({
      where: { id },
      data: {
        title: dto.title,
        author: dto.author,
        description: dto.description,
        price: dto.price,
        categoryId: dto.categoryId
      }
    });
  }

  async deleteBook(id: number): Promise<Book> {
    return this.prisma.book.delete({
      where: { id }
    });
  }
}
