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
      const { accessToken } =
        await this.authRepository.signup(dto);
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
      const { accessToken, userId } =
        await this.authRepository.signin(dto);
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
}
