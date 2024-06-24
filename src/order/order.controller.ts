import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  UseFilters
} from '@nestjs/common';
import { OrderService } from './order.service';
import {
  CreateOrderDto,
  EditOrderDto
} from './dto';
import { Guard } from '../auth/guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { HttpExceptionFilter } from '../exceptions/http-exception.filter';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';

@UseGuards(Guard)
@UseFilters(HttpExceptionFilter)
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService
  ) {}

  @Post()
  createOrder(
    @Body() dto: CreateOrderDto,
    @GetUser() user: User
  ) {
    return this.orderService.createOrder(
      user.id,
      dto
    );
  }

  @Patch(':id/confirm')
  confirmOrder(
    @Param('id', ParseIntPipe) orderId: number,
    @GetUser() user: User
  ) {
    return this.orderService.confirmOrder(
      user.id,
      orderId
    );
  }

  @Get(':id')
  getOrderById(
    @Param('id', ParseIntPipe) orderId: number,
    @GetUser() user: User
  ) {
    return this.orderService.getOrderById(
      user.id,
      orderId
    );
  }

  @Get()
  @Roles('ADMIN')
  getAllOrders() {
    return this.orderService.listOrders();
  }

  @Patch(':id')
  editOrder(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() dto: EditOrderDto,
    @GetUser() user: User
  ) {
    return this.orderService.editOrder(
      user.id,
      orderId,
      dto
    );
  }

  @Delete(':id')
  async deleteOrder(
    @Param('id', ParseIntPipe)
    orderId: number,
    @GetUser() user: User
  ) {
    return this.orderService.deleteOrder(
      user.id,
      orderId
    );
  }
}
