import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  MinLength,
  MaxLength
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    description: 'Title of the book'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'Author of the book'
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  author: string;

  @ApiProperty({
    description: 'Description of the book'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(400)
  description: string;

  @ApiProperty({
    description: 'Price of the book (in cents)'
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Quantity of books in stock'
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;

  @ApiProperty({
    description:
      'ID of the category the book belongs to'
  })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}
