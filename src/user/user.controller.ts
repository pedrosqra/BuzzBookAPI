import {
  Controller,
  Get,
  Patch,
  Delete,
  UseGuards,
  Param,
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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth
} from '@nestjs/swagger';

@ApiTags('users')
@UseGuards(Guard)
@UseFilters(HttpExceptionFilter)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Get('me')
  @ApiOperation({
    summary:
      'Get the currently logged-in user profile.'
  })
  @ApiResponse({
    status: 200,
    description: 'User login info'
  })
  @ApiBearerAuth()
  getMe(@GetUser() user: User) {
    return this.userService.getUserById(user.id);
  }

  @Get(':id')
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Get a user by ID (admin only).'
  })
  @ApiParam({
    name: 'id',
    description: 'User info',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'User details.'
  })
  @ApiBearerAuth()
  getUser(
    @Param('id', ParseIntPipe) userId: number
  ) {
    return this.userService.getUserById(userId);
  }

  @Patch()
  @ApiOperation({
    summary:
      'Update the currently logged-in user profile.'
  })
  @ApiResponse({
    status: 200,
    description:
      'User info after successfully updated.'
  })
  @ApiBearerAuth()
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
  @ApiOperation({
    summary:
      'Delete the currently logged-in user.'
  })
  @ApiResponse({
    status: 200,
    description:
      'User info after successfully deleted.'
  })
  @ApiBearerAuth()
  deleteUser(@GetUser() user: User) {
    return this.userService.deleteUser(user.id);
  }
}
