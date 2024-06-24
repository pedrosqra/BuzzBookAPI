import {
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { User } from '.prisma/client';

@Injectable()
export class UserRepository {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async getUserById(
    userId: number
  ): Promise<User> {
    const user = await this.findUserById(userId);
    const userWithoutSensitiveData =
      this.removeSensitiveData(user);

    return userWithoutSensitiveData;
  }

  async editUser(
    userId: number,
    dto: EditUserDto
  ): Promise<User> {
    const updatedUser = await this.updateUser(
      userId,
      dto
    );

    return updatedUser;
  }

  async deleteUser(
    userId: number
  ): Promise<User> {
    const deleteData =
      await this.prisma.user.delete({
        where: { id: userId }
      });

    return deleteData;
  }

  private async findUserById(
    userId: number
  ): Promise<User> {
    const user =
      await this.prisma.user.findUnique({
        where: { id: userId }
      });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  private async updateUser(
    userId: number,
    dto: EditUserDto
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { ...dto }
    });
  }

  private removeSensitiveData(user: any): any {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
  }
}
