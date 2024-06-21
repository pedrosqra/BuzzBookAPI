import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async editUser(userId: string, dto: EditUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.user.update({
      where: { id: parseInt(userId) },
      data: { ...dto }
    });
  }

  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (user) {
      await this.prisma.user.delete({ where: { id: parseInt(userId) } });
      return { message: 'User deleted successfully' };
    }
    throw new NotFoundException('User not found');
  }
}
