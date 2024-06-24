import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from '../prisma/prisma.service';
import { OrderRepository } from './order.repository';
import { BookService } from '../book/book.service';
import { BookRepository } from '../book/book.repository';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    BookService,
    BookRepository,
    PrismaService
  ]
})
export class OrderModule {}
