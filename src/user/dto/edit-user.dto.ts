import {
  IsOptional,
  IsString,
  IsEmail,
  MinLength,
  MaxLength
} from 'class-validator';

export class EditUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
