import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsPostalCode,
  IsStrongPassword,
  IsOptional,
  IsIn,
  MinLength,
  MaxLength
} from 'class-validator';

export class SignupDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
    minLowercase: 1
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(40)
  street: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(40)
  district: string;

  @IsString()
  @IsNotEmpty()
  @IsPostalCode('BR')
  postalCode: string;

  @IsString()
  @IsOptional()
  @IsIn(['USER', 'ADMIN'])
  role?: string;
}
