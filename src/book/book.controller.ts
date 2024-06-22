import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards
} from '@nestjs/common';
import { BookService } from './book.service';
import {
  CreateBookDto,
  EditBookDto
} from './dto';
import { Guard } from 'src/auth/guard';
import { Roles } from '../auth/decorator/roles.decorator';

@UseGuards(Guard)
@Controller('books')
export class BookController {
  constructor(
    private readonly bookService: BookService
  ) {}

  @Post()
  @Roles('ADMIN')
  createBook(@Body() dto: CreateBookDto) {
    return this.bookService.createBook(dto);
  }

  @Get('search')
  getBooksByTitle(@Query('title') title: string) {
    return this.bookService.getBooksByTitle(
      title
    );
  }

  @Get(':id')
  getBookById(@Param('id') bookId: string) {
    return this.bookService.getBookById(
      parseInt(bookId, 10)
    );
  }

  @Get()
  getAllBooks() {
    return this.bookService.getAllBooks();
  }

  @Get('category/:id')
  getBooksByCategory(@Param('id') id: string) {
    const categoryId = parseInt(id);
    return this.bookService.getBooksByCategory(
      categoryId
    );
  }

  @Patch(':id')
  @Roles('ADMIN')
  editBook(
    @Param('id') bookId: string,
    @Body() dto: EditBookDto
  ) {
    return this.bookService.editBook(
      parseInt(bookId),
      dto
    );
  }

  @Delete(':id')
  @Roles('ADMIN')
  deleteBook(@Param('id') bookId: string) {
    return this.bookService.deleteBook(
      parseInt(bookId)
    );
  }
}
