import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from '../prisma/prisma.service';
import { OrderRepository } from './order.repository';
import { BookRepository } from '../book/book.repository';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    BookRepository,
    PrismaService
  ]
})
export class OrderModule {}
