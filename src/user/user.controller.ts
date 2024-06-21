import {
  Controller,
  Get,
  Patch,
  UseGuards,
  Param,
  Delete,
  Body
} from '@nestjs/common';
import { Guard } from '../auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { EditUserDto } from './dto/edit-user.dto';

@UseGuards(Guard)
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
  getUser(@Param('id') userId: string) {
    return this.userService.getUserById(userId);
  }

  @Patch(':id')
  editUser(
    @Param('id') userId: string,
    @Body() dto: EditUserDto
  ) {
    return this.userService.editUser(userId, dto);
  }

  @Delete(':id')
  deleteUser(@Param('id') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
