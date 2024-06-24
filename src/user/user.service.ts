import {
  HttpStatus,
  Injectable,
  NotFoundException,
  Logger,
  ForbiddenException
} from '@nestjs/common';
import { EditUserDto } from './dto';
import { buildResponse } from '../util/response.util';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(
    UserService.name
  );

  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async getUserById(userId: number) {
    const user = await this.findUserById(userId);
    const userWithoutSensitiveData =
      this.removeSensitiveData(user);

    return buildResponse(
      HttpStatus.OK,
      `User got with id ${userId}`,
      userWithoutSensitiveData
    );
  }

  async editUser(
    userId: number,
    dto: EditUserDto
  ) {
    await this.findUserById(userId);
    const updatedUser = await this.updateUser(
      userId,
      dto
    );

    return buildResponse(
      HttpStatus.OK,
      `User updated with id ${userId}`,
      updatedUser
    );
  }

  async deleteUser(userId: number) {
    const user = await this.findUserById(userId);

    try {
      if (user.id !== userId) {
        throw new ForbiddenException(
          'Not authorize to delete another user apart from yourselft'
        );
      }
      const deleteData =
        await this.userRepository.deleteUser(
          userId
        );

      const returnData =
        this.removeSensitiveData(deleteData);

      return buildResponse(
        HttpStatus.OK,
        `User with id ${userId} deleted successfully`,
        returnData
      );
    } catch (error) {
      this.logger.error(
        `Error when trying to delete user with id ${userId} `,
        error
      );
      throw error;
    }
  }

  private async findUserById(userId: number) {
    try {
      const user =
        await this.userRepository.getUserById(
          userId
        );

      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch (error) {
      this.logger.error(
        `Error when trying to find user with id ${userId}:`,
        error
      );
      throw new NotFoundException(
        'User not found'
      );
    }
  }

  private async updateUser(
    userId: number,
    dto: EditUserDto
  ) {
    await this.findUserById(userId);
    return this.userRepository.editUser(
      userId,
      dto
    );
  }

  private removeSensitiveData(user: any) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
  }
}
