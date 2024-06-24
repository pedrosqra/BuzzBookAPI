import {
  Injectable,
  ForbiddenException,
  Logger
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignupDto, AuthDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from './auth.repository';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(
    AuthService.name
  );
  constructor(
    private readonly authRepository: AuthRepository,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async signup(
    dto: SignupDto
  ): Promise<{ accessToken: string }> {
    try {
      const data =
        await this.authRepository.signup(dto);
      const user = data.user;
      const accessToken = await this.signToken(
        user.id,
        user.email,
        user.role
      );
      return { accessToken };
    } catch (error) {
      this.logger.error(
        'Error when trying to signup:',
        error
      );
      if (
        error instanceof ForbiddenException ||
        (error.code === 'P2002' &&
          error instanceof
            PrismaClientKnownRequestError)
      ) {
        throw new ForbiddenException(
          'Credentials taken'
        );
      }
      throw error;
    }
  }

  async signin(dto: AuthDto): Promise<{
    accessToken: string;
    userId: number;
  }> {
    try {
      const data =
        await this.authRepository.signin(dto);

      const user = data.user;
      if (!user) {
        throw new ForbiddenException();
      }

      const pwMatches = await argon.verify(
        user.hash,
        dto.password
      );

      if (!pwMatches) {
        throw new ForbiddenException();
      }

      const accessToken = await this.signToken(
        user.id,
        user.email,
        user.role
      );
      const userId = user.id;
      return { accessToken, userId };
    } catch (error) {
      this.logger.error(
        'Error when trying to signin:',
        error
      );
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(
          'Credentials incorrect'
        );
      }
      throw error;
    }
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
