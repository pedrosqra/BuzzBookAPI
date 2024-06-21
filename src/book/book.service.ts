import {
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateBookDto,
  EditBookDto
} from './dto';

@Injectable()
export class BookService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async createBook(dto: CreateBookDto) {
    const {
      title,
      author,
      description,
      price,
      quantity,
      categoryId
    } = dto;

    const book = this.prisma.book.create({
      data: {
        title,
        author,
        description,
        price,
        bookQuantity: quantity,
        categoryId
      }
    });
    return book;
  }

  async getBookById(bookId: number) {
    const book =
      await this.prisma.book.findUnique({
        where: { id: bookId }
      });
    if (!book) {
      throw new NotFoundException(
        'Book not found'
      );
    }
    return book;
  }

  async getAllBooks() {
    return this.prisma.book.findMany();
  }

  async getBooksByCategory(categoryId: number) {
    return this.prisma.book.findMany({
      where: { categoryId }
    });
  }

  async editBook(
    bookId: number,
    dto: EditBookDto
  ) {
    const book =
      await this.prisma.book.findUnique({
        where: { id: bookId }
      });
    if (!book) {
      throw new NotFoundException(
        'Book not found'
      );
    }

    return this.prisma.book.update({
      where: { id: bookId },
      data: {
        title: dto.title,
        author: dto.author,
        description: dto.description,
        price: dto.price
      }
    });
  }

  async deleteBook(bookId: number) {
    const book =
      await this.prisma.book.findUnique({
        where: { id: bookId }
      });
    if (!book) {
      throw new NotFoundException(
        'Book not found'
      );
    }
    await this.prisma.book.delete({
      where: { id: bookId }
    });
    return {
      message: 'Book deleted successfully'
    };
  }
}
