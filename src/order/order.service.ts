import {
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateOrderDto,
  EditOrderDto
} from './dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async createOrder(dto: CreateOrderDto) {
    const { userId, bookId, quantity } = dto;

    this.isBookAvailable(bookId, quantity);

    return this.prisma.order.create({
      data: {
        quantity: quantity,
        status: 'pending',
        user: { connect: { id: userId } },
        book: { connect: { id: bookId } }
      }
    });
  }

  async confirmOrder(orderId: number) {
    const status = 'confirmed';

    const order =
      await this.prisma.order.findUnique({
        where: { id: orderId }
      });
    if (!order) {
      throw new NotFoundException(
        `Order with id ${orderId} not found`
      );
    }

    const updatedOrder =
      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status
        }
      });

    await this.prisma.book.update({
      where: { id: order.bookId },
      data: {
        bookQuantity: {
          decrement: order.quantity
        }
      }
    });

    return updatedOrder;
  }

  async getOrderById(orderId: number) {
    const order =
      await this.prisma.order.findUnique({
        where: { id: orderId },
        include: { user: true, book: true }
      });
    if (!order) {
      throw new NotFoundException(
        'Order not found'
      );
    }
    return order;
  }

  async getAllOrders() {
    return this.prisma.order.findMany({
      include: { user: true, book: true }
    });
  }

  async editOrder(
    orderId: number,
    dto: EditOrderDto
  ) {
    const order =
      await this.prisma.order.findUnique({
        where: { id: orderId }
      });
    if (!order) {
      throw new NotFoundException(
        'Order not found'
      );
    }

    const { quantity, status } = dto;
    return this.prisma.order.update({
      where: { id: orderId },
      data: { quantity, status }
    });
  }

  async deleteOrder(orderId: number) {
    const order =
      await this.prisma.order.findUnique({
        where: { id: orderId }
      });
    if (!order) {
      throw new NotFoundException(
        'Order not found'
      );
    }

    await this.prisma.order.delete({
      where: { id: orderId }
    });

    return {
      message: 'Order deleted successfully'
    };
  }

  async isBookAvailable(
    bookIdInteger: number,
    quantity: number
  ) {
    const book =
      await this.prisma.book.findUnique({
        where: { id: bookIdInteger }
      });

    if (!book) {
      throw new NotFoundException(
        `Book with id ${bookIdInteger} not found`
      );
    }

    if (!(book.bookQuantity >= quantity)) {
      throw new NotFoundException(
        `Book with id ${bookIdInteger} not available`
      );
    }
  }
}
