import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body
} from '@nestjs/common';
import { BookService } from './book.service';
import {
  CreateBookDto,
  EditBookDto
} from './dto';

@Controller('books')
export class BookController {
  constructor(
    private readonly bookService: BookService
  ) {}

  @Post()
  createBook(@Body() dto: CreateBookDto) {
    return this.bookService.createBook(dto);
  }

  @Get(':id')
  getBookById(@Param('id') bookId: string) {
    return this.bookService.getBookById(
      parseInt(bookId)
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
  deleteBook(@Param('id') bookId: string) {
    return this.bookService.deleteBook(
      parseInt(bookId)
    );
  }
}
