import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common';
import { OrderService } from './order.service';
import {
  CreateOrderDto,
  EditOrderDto
} from './dto';
import { Guard } from 'src/auth/guard';
import { Roles } from '../auth/decorator/roles.decorator';

@UseGuards(Guard)
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService
  ) {}

  @Post()
  createOrder(@Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(dto);
  }

  @Patch(':id/confirm')
  confirmOrder(
    @Param('id', ParseIntPipe) orderId: number
  ) {
    return this.orderService.confirmOrder(
      orderId
    );
  }

  @Get(':id')
  getOrderById(@Param('id') orderId: string) {
    return this.orderService.getOrderById(
      parseInt(orderId)
    );
  }

  @Get()
  @Roles('ADMIN')
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Patch(':id')
  editOrder(
    @Param('id') orderId: string,
    @Body() dto: EditOrderDto
  ) {
    return this.orderService.editOrder(
      parseInt(orderId),
      dto
    );
  }

  @Delete(':id')
  deleteOrder(
    @Param('id: string') orderId: string
  ) {
    return this.orderService.deleteOrder(
      parseInt(orderId)
    );
  }
}
