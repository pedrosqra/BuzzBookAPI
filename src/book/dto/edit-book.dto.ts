import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Title of the book',
    required: false
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title?: string;

  @ApiProperty({
    description: 'Author of the book',
    required: false
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(100)
  author?: string;

  @ApiProperty({
    description: 'Description of the book',
    required: false
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(400)
  description?: string;

  @ApiProperty({
    description: 'Price of the book (in cents)',
    required: false
  })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  price?: number;

  @ApiProperty({
    description: 'Quantity of books in stock'
  })
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @IsPositive()
  quantity?: number;

  @ApiProperty({
    description:
      'ID of the category the book belongs to',
    required: false
  })
  @IsNumber()
  @IsOptional()
  categoryId?: number;
}
