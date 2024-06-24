import {
  Injectable,
  Logger
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order } from '@prisma/client';
import { CreateOrderDto } from './dto';

@Injectable()
export class OrderRepository {
  private readonly logger = new Logger(
    OrderRepository.name
  );

  constructor(private prisma: PrismaService) {}

  async createOrder(
    loggedUserId: number,
    dto: CreateOrderDto
  ): Promise<Order> {
    const { bookId, quantity } = dto;

    return this.prisma.order.create({
      data: {
        quantity,
        status: 'pending',
        user: { connect: { id: loggedUserId } },
        book: { connect: { id: bookId } }
      }
    });
  }

  async findById(
    orderId: number
  ): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, book: true }
    });
  }

  async findByUserId(
    userId: number
  ): Promise<Order[] | null> {
    return this.prisma.order.findMany({
      where: { userId },
      include: { user: true, book: true }
    });
  }

  async findAll(): Promise<Order[]> {
    return this.prisma.order.findMany({
      include: { user: true, book: true }
    });
  }

  async updateOrder(
    orderId: number,
    data: Partial<Order>
  ): Promise<Order> {
    return this.prisma.order.update({
      where: { id: orderId },
      data
    });
  }

  async confirmOrder(
    orderId: number,
    bookId: number,
    quantity: number
  ): Promise<Order> {
    const updatedOrder =
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'confirmed' }
      });

    await this.prisma.book.update({
      where: { id: bookId },
      data: {
        bookQuantity: {
          decrement: quantity
        }
      }
    });

    return updatedOrder;
  }

  async deleteOrder(
    orderId: number
  ): Promise<Order> {
    return this.prisma.order.delete({
      where: { id: orderId }
    });
  }
}
