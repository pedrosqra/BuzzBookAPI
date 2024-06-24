import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto, AuthDto } from './dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class AuthRepository {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async signup(
    dto: SignupDto
  ): Promise<{ user: User }> {
    const hash = await argon.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role || 'USER',
        Address: {
          create: {
            street: dto.street,
            district: dto.district,
            postalCode: dto.postalCode
          }
        }
      }
    });
    return { user };
  }

  async signin(dto: AuthDto): Promise<{
    user: User;
  }> {
    const user =
      await this.prisma.user.findUnique({
        where: { email: dto.email }
      });
    return { user };
  }
}
