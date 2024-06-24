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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth
} from '@nestjs/swagger';

@ApiTags('books')
@UseFilters(HttpExceptionFilter)
@Controller('books')
export class BookController {
  constructor(
    private readonly bookService: BookService
  ) {}

  @Post()
  @UseGuards(Guard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({
    status: 201,
    description: 'Info about the created book.'
  })
  @ApiBearerAuth()
  createBook(@Body() dto: CreateBookDto) {
    return this.bookService.createBook(dto);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search books by title'
  })
  @ApiQuery({
    name: 'title',
    description: 'Title to search for'
  })
  @ApiResponse({
    status: 200,
    description:
      'List of books matching the search criteria'
  })
  getBooksByTitle(@Query('title') title: string) {
    return this.bookService.getBooksByTitle(
      title
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by ID' })
  @ApiParam({
    name: 'id',
    description: 'Book ID'
  })
  @ApiResponse({
    status: 200,
    description: 'Book details'
  })
  getBookById(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.bookService.getBookById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({
    status: 200,
    description: 'List of all books'
  })
  getAllBooks() {
    return this.bookService.getAllBooks();
  }

  @Get('category/:id')
  @ApiOperation({
    summary: 'Get books by category ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Category ID'
  })
  @ApiResponse({
    status: 200,
    description:
      'List of books in the specified category'
  })
  getBooksByCategory(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.bookService.getBooksByCategory(
      id
    );
  }

  @Patch(':id')
  @UseGuards(Guard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Update a book by ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Book ID'
  })
  @ApiResponse({
    status: 200,
    description: 'Info about the updated book.'
  })
  @ApiBearerAuth()
  editBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditBookDto
  ) {
    return this.bookService.editBook(id, dto);
  }

  @Delete(':id')
  @UseGuards(Guard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Delete a book by ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Book ID'
  })
  @ApiResponse({
    status: 200,
    description: 'Info about the deleted book.'
  })
  @ApiBearerAuth()
  deleteBook(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.bookService.deleteBook(id);
  }
}
