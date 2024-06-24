import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  MinLength,
  MaxLength
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  author: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(400)
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}
