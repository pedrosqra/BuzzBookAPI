import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BookRepository } from './book.repository';

@Module({
  imports: [PrismaModule],
  controllers: [BookController],
  providers: [BookService, BookRepository]
})
export class BookModule {}
