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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth
} from '@nestjs/swagger';

@ApiTags('orders')
@UseGuards(Guard)
@UseFilters(HttpExceptionFilter)
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description:
      'Info about the  successfully created order.'
  })
  @ApiBearerAuth()
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
  @ApiOperation({
    summary: 'Confirm an order by ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description:
      'Info about the successfully confirmed order.'
  })
  @ApiBearerAuth()
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
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Order details'
  })
  @ApiBearerAuth()
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
  @ApiOperation({
    summary: 'Get all orders (admin only)'
  })
  @ApiResponse({
    status: 200,
    description: 'List of all orders'
  })
  @ApiBearerAuth()
  getAllOrders() {
    return this.orderService.listOrders();
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an order by ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description:
      'Info about the successfully updated order.'
  })
  @ApiBearerAuth()
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
  @ApiOperation({
    summary: 'Delete an order by ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description:
      'Info about the successfully deleted.'
  })
  @ApiBearerAuth()
  async deleteOrder(
    @Param('id', ParseIntPipe) orderId: number,
    @GetUser() user: User
  ) {
    return this.orderService.deleteOrder(
      user.id,
      orderId
    );
  }
}
