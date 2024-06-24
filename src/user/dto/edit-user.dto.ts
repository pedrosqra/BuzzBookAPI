import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEmail,
  MinLength,
  MaxLength
} from 'class-validator';

export class EditUserDto {
  @ApiProperty({
    description: 'First name of the user',
    required: false,
    example: 'John'
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  firstName?: string;

  @ApiProperty({
    description: 'Last name of the user',
    required: false,
    example: 'Doe'
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  lastName?: string;

  @ApiProperty({
    description: 'Email address of the user',
    required: false,
    example: 'johndoe@example.com'
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}
