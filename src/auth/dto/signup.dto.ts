import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsPostalCode,
  IsStrongPassword,
  IsOptional
} from 'class-validator';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  @IsPostalCode()
  postalCode: string;

  @IsString()
  @IsOptional()
  role?: string;
}
