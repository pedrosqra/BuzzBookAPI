import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsIn,
  MinLength,
  MaxLength
} from 'class-validator';
import { IsStrongPassword } from '../validator/password.validator';
import { IsPostalCodeBR } from '../validator/postal-code.validator';

export class SignupDto {
  @ApiProperty({
    description: 'User email address'
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password (must be strong)'
  })
  @IsString()
  @IsStrongPassword()
  password: string;

  @ApiProperty({ description: 'User first name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  lastName: string;

  @ApiProperty({ description: 'Street address' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(40)
  street: string;

  @ApiProperty({ description: 'District' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(40)
  district: string;

  @ApiProperty({
    description: 'Postal code (Brazilian format)'
  })
  @IsString()
  @IsNotEmpty()
  @IsPostalCodeBR()
  postalCode: string;

  @ApiProperty({
    description:
      'User role (optional, defaults to "USER")',
    enum: ['USER', 'ADMIN'],
    default: 'USER'
  })
  @IsString()
  @IsOptional()
  @IsIn(['USER', 'ADMIN'])
  role?: string;
}
