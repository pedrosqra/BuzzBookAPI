import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {
  ConfigModule,
  ConfigService
} from '@nestjs/config';
import { AuthRepository } from './auth.repository';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService
      ) => ({
        secret:
          configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' }
      })
    })
  ],
  providers: [
    AuthService,
    AuthRepository,
    JwtStrategy
  ],
  controllers: [AuthController]
})
export class AuthModule {}
