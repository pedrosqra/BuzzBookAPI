import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { OrderRepository } from './order.repository';
import {
  CreateOrderDto,
  EditOrderDto
} from './dto';
import { buildResponse } from '../util/response.util';
import { BookRepository } from '../book/book.repository';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(
    OrderService.name
  );

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly bookRepository: BookRepository
  ) {}

  async createOrder(
    loggedUserId: number,
    dto: CreateOrderDto
  ) {
    try {
      await this.validateBookAvailability(
        dto.bookId,
        dto.quantity
      );

      const order =
        await this.orderRepository.createOrder(
          loggedUserId,
          dto
        );

      return buildResponse(
        HttpStatus.CREATED,
        'Order created successfully',
        order
      );
    } catch (error) {
      this.logger.error(
        'Error creating order:',
        error
      );
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof
          InternalServerErrorException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to create order'
        );
      }
    }
  }

  async confirmOrder(
    userId: number,
    orderId: number
  ) {
    try {
      const order =
        await this.getOrderWithAuthorizationCheck(
          userId,
          orderId
        );

      if (order.status === 'confirmed') {
        throw new BadRequestException(
          `Order with id ${orderId} is already confirmed`
        );
      }

      await this.validateBookAvailability(
        order.bookId,
        order.quantity
      );

      const updatedOrder =
        await this.orderRepository.confirmOrder(
          orderId,
          order.bookId,
          order.quantity
        );
      return buildResponse(
        HttpStatus.OK,
        'Order confirmed successfully',
        updatedOrder
      );
    } catch (error) {
      this.logger.error(
        'Error confirming order:',
        error
      );
      throw error;
    }
  }

  async getOrderById(
    userId: number,
    orderId: number
  ) {
    try {
      const order =
        await this.getOrderWithAuthorizationCheck(
          userId,
          orderId
        );

      return buildResponse(
        HttpStatus.OK,
        `Order retrieved successfully`,
        order
      );
    } catch (error) {
      this.logger.error(
        'Error getting order by ID:',
        error
      );
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof
          InternalServerErrorException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to retrieve order'
        );
      }
    }
  }

  async listOrders() {
    try {
      const orders =
        await this.orderRepository.findAll();

      if (!orders || orders.length === 0) {
        throw new NotFoundException(
          'No orders found'
        );
      }
      return buildResponse(
        HttpStatus.OK,
        'Orders listed successfully',
        orders
      );
    } catch (error) {
      this.logger.error(
        'Error listing orders:',
        error
      );
      if (
        error instanceof NotFoundException ||
        error instanceof
          InternalServerErrorException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to list orders'
        );
      }
    }
  }

  async editOrder(
    userId: number,
    orderId: number,
    dto: EditOrderDto
  ) {
    try {
      const order =
        await this.getOrderWithAuthorizationCheck(
          userId,
          orderId
        );

      await this.validateUserAuthorization(
        userId,
        order.userId
      );

      const updatedOrder =
        await this.orderRepository.updateOrder(
          orderId,
          {
            quantity: dto.quantity
          }
        );
      return buildResponse(
        HttpStatus.OK,
        'Order updated successfully',
        updatedOrder
      );
    } catch (error) {
      this.logger.error(
        'Error editing order:',
        error
      );
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof
          InternalServerErrorException
      ) {
        throw error;
      }
    }
  }

  async deleteOrder(
    userId: number,
    orderId: number
  ) {
    try {
      await this.getOrderWithAuthorizationCheck(
        userId,
        orderId
      );

      const deletedOrder =
        await this.orderRepository.deleteOrder(
          orderId
        );
      return buildResponse(
        HttpStatus.OK,
        'Order deleted successfully',
        deletedOrder
      );
    } catch (error) {
      this.logger.error(
        'Error deleting order:',
        error
      );
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof
          InternalServerErrorException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to delete order'
        );
      }
    }
  }

  private async getOrderWithAuthorizationCheck(
    userId: number,
    orderId: number
  ) {
    const order =
      await this.orderRepository.findById(
        orderId
      );

    if (!order) {
      throw new NotFoundException(
        'Order not found'
      );
    }

    try {
      this.validateUserAuthorization(
        userId,
        order.userId
      );
      return order;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(
          'User not authorized to perform this operation'
        );
      } else {
        this.logger.error(
          'Unexpected error in getOrderWithAuthorizationCheck:',
          error
        );
      }
    }
  }

  private async validateBookAvailability(
    bookId: number,
    quantity: number
  ): Promise<void> {
    const book =
      await this.bookRepository.findById(bookId);

    if (!book) {
      throw new NotFoundException(
        'Book not found'
      );
    }

    if (book.bookQuantity < quantity) {
      throw new BadRequestException(
        `Book with id ${bookId} is not available or has insufficient quantity`
      );
    }
  }

  validateUserAuthorization(
    loggedUserId: number,
    orderUserId: number
  ): void {
    if (loggedUserId !== orderUserId) {
      throw new ForbiddenException(
        'You are not authorized to access this order'
      );
    }
  }
}
