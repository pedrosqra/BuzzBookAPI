import {
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto, AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async signup(
    dto: SignupDto
  ): Promise<{ accessToken: string }> {
    const hash = await argon.hash(dto.password);
    try {
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
      const accessToken = await this.signToken(
        user.id,
        user.email,
        user.role
      );
      return { accessToken };
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Credentials taken'
          );
        }
      }
      throw error;
    }
  }

  async signin(
    dto: AuthDto
  ): Promise<{ accessToken: string }> {
    const user =
      await this.prisma.user.findUnique({
        where: { email: dto.email }
      });

    if (!user)
      throw new ForbiddenException(
        'Credentials incorrect'
      );

    const pwMatches = await argon.verify(
      user.hash,
      dto.password
    );

    if (!pwMatches)
      throw new ForbiddenException(
        'Credentials incorrect'
      );

    const accessToken = await this.signToken(
      user.id,
      user.email,
      user.role
    );
    return { accessToken };
  }

  private async signToken(
    userId: number,
    email: string,
    role: string
  ): Promise<string> {
    const payload = { sub: userId, email, role };
    const secret =
      this.config.get<string>('JWT_SECRET');

    return this.jwt.signAsync(payload, {
      expiresIn: '30m',
      secret
    });
  }
}
