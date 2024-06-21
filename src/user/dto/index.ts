import { IsOptional, IsString, IsEmail } from 'class-validator';

export class EditUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  // Add other fields as necessary
}
