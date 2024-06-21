import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto, EditBookDto } from './dto';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  async createBook(dto: CreateBookDto) {
    const price = parseFloat(dto.price);
    console.log(price);
    const quantity = parseInt(dto.quantity);
    return this.prisma.book.create({
      data: {
        ...dto,
        price,
        quantity
      }
    });
  }

  async getBookById(bookId: number) {
    const book = await this.prisma.book.findUnique({
      where: { id: bookId }
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async getAllBooks() {
    return this.prisma.book.findMany();
  }

  async editBook(bookId: number, dto: EditBookDto) {
    const book = await this.prisma.book.findUnique({
      where: { id: bookId }
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    const newPrice = parseFloat(dto.price);

    return this.prisma.book.update({
      where: { id: bookId },
      data: {
        title: dto.title,
        author: dto.author,
        description: dto.description,
        price: newPrice
      }
    });
  }

  async deleteBook(bookId: number) {
    const book = await this.prisma.book.findUnique({
      where: { id: bookId }
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    await this.prisma.book.delete({
      where: { id: bookId }
    });
    return { message: 'Book deleted successfully' };
  }
}
