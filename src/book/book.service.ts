import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  HttpStatus
} from '@nestjs/common';
import { BookRepository } from './book.repository';
import {
  CreateBookDto,
  EditBookDto
} from './dto';
import { buildResponse } from '../util/response.util';

@Injectable()
export class BookService {
  private readonly logger = new Logger(
    BookService.name
  );

  constructor(
    private readonly bookRepository: BookRepository
  ) {}

  async createBook(dto: CreateBookDto) {
    try {
      const book =
        await this.bookRepository.createBook(dto);

      return buildResponse(
        HttpStatus.CREATED,
        'Book created successfully',
        book
      );
    } catch (error) {
      this.logger.error(
        'Error creating book:',
        error
      );

      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Invalid category ID'
        );
      } else {
        throw new InternalServerErrorException(
          'Failed to create book'
        );
      }
    }
  }

  async getBooksByTitle(title: string) {
    try {
      const books =
        await this.bookRepository.findByTitle(
          title
        );
      if (!books.length) {
        throw new NotFoundException();
      }

      return buildResponse(
        HttpStatus.OK,
        'Books listed by title successfully',
        books
      );
    } catch (error) {
      this.logger.error(
        'Error searching books by title:',
        error
      );
      throw new NotFoundException(
        `No books with title '${title}' found`
      );
    }
  }

  async getBookById(bookId: number) {
    try {
      const book =
        await this.findBookById(bookId);

      if (!book) {
        throw new NotFoundException(
          'Book not found'
        );
      }

      return buildResponse(
        HttpStatus.OK,
        `Book found with id ${bookId}`,
        book
      );
    } catch (error) {
      this.logger.error(
        'Error getting book by ID:',
        error
      );
      throw new NotFoundException(
        'Book not found'
      );
    }
  }

  async getAllBooks() {
    try {
      const books =
        await this.bookRepository.findAll();

      return buildResponse(
        HttpStatus.OK,
        'Books listed successfully',
        books
      );
    } catch (error) {
      this.logger.error(
        'Error getting all books:',
        error
      );
      throw new InternalServerErrorException(
        'Failed to get all books'
      );
    }
  }

  async getBooksByCategory(categoryId: number) {
    try {
      const books =
        await this.bookRepository.findByCategory(
          categoryId
        );

      if (!books.length) {
        throw new NotFoundException();
      }

      return buildResponse(
        HttpStatus.OK,
        'Books listed by category successfully',
        books
      );
    } catch (error) {
      this.logger.error(
        'Error getting books by category:',
        error
      );
      throw new NotFoundException(
        'No book was found in this category'
      );
    }
  }

  async editBook(
    bookId: number,
    dto: EditBookDto
  ) {
    try {
      const book =
        await this.findBookById(bookId);

      if (!book) {
        throw new NotFoundException(
          'Book not found'
        );
      }
      const updatedBook =
        await this.bookRepository.updateBook(
          bookId,
          dto
        );

      return buildResponse(
        HttpStatus.OK,
        'Book edited successfully',
        updatedBook
      );
    } catch (error) {
      this.logger.error(
        'Error editing book:',
        error
      );
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Another book with this title already exists'
        );
      } else if (error.code === 'P2003') {
        throw new BadRequestException(
          'Invalid category ID'
        );
      } else {
        throw new InternalServerErrorException(
          'Failed to edit book'
        );
      }
    }
  }

  async deleteBook(bookId: number) {
    try {
      const book =
        await this.findBookById(bookId);

      if (!book) {
        throw new NotFoundException(
          'Book not found'
        );
      }

      const deleteData =
        await this.bookRepository.deleteBook(
          bookId
        );

      return buildResponse(
        200,
        'Books deleted successfully',
        deleteData
      );
    } catch (error) {
      this.logger.error(
        'Error deleting book:',
        error
      );
      throw new InternalServerErrorException(
        'Failed to delete book'
      );
    }
  }

  private async findBookById(bookId: number) {
    const book =
      await this.bookRepository.findById(bookId);
    if (!book) {
      throw new NotFoundException(
        'Book not found'
      );
    }
    return book;
  }
}
