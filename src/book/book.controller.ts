import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseFilters,
  ParseIntPipe
} from '@nestjs/common';
import { BookService } from './book.service';
import {
  CreateBookDto,
  EditBookDto
} from './dto';
import { Guard } from '../auth/guard/';
import { Roles } from '../auth/decorator/roles.decorator';
import { HttpExceptionFilter } from '../exceptions/http-exception.filter';

@UseGuards(Guard)
@UseFilters(HttpExceptionFilter)
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
  getBookById(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.bookService.getBookById(id);
  }

  @Get()
  getAllBooks() {
    return this.bookService.getAllBooks();
  }

  @Get('category/:id')
  getBooksByCategory(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.bookService.getBooksByCategory(
      id
    );
  }

  @Patch(':id')
  @Roles('ADMIN')
  editBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditBookDto
  ) {
    return this.bookService.editBook(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  deleteBook(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.bookService.deleteBook(id);
  }
}
