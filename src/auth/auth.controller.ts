import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, SignupDto } from './dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({
    summary: 'Register a new user'
  })
  @ApiResponse({
    status: 201,
    description:
      'User registered successfully. Returns an access token.',
    type: String
  })
  signup(@Body() authDto: SignupDto) {
    return this.authService.signup(authDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiOperation({
    summary:
      'Sign in with existing user credentials'
  })
  @ApiResponse({
    status: 201,
    description:
      'User logged in successfully. Returns an access token.',
    type: String
  })
  signin(@Body() authDto: AuthDto) {
    return this.authService.signin(authDto);
  }
}
