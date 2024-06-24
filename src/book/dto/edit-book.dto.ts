import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsPositive
} from 'class-validator';

export class EditBookDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(100)
  author?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(400)
  description?: string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  price?: number;

  @IsNumber()
  @IsOptional()
  categoryId?: number;
}
