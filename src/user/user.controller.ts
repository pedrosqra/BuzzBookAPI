import {
  Controller,
  Get,
  Patch,
  UseGuards,
  Param,
  Delete,
  Body,
  ParseIntPipe,
  UseFilters
} from '@nestjs/common';
import { Guard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { EditUserDto } from './dto/edit-user.dto';
import { Roles } from '../auth/decorator/roles.decorator';
import { HttpExceptionFilter } from '../exceptions/http-exception.filter';

@UseGuards(Guard)
@UseFilters(HttpExceptionFilter)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get(':id')
  @Roles('ADMIN')
  getUser(
    @Param('id', ParseIntPipe) userId: number
  ) {
    return this.userService.getUserById(userId);
  }

  @Patch()
  editUser(
    @GetUser() user: User,
    @Body() dto: EditUserDto
  ) {
    return this.userService.editUser(
      user.id,
      dto
    );
  }

  @Delete()
  deleteUser(@GetUser() user: User) {
    return this.userService.deleteUser(user.id);
  }
}
