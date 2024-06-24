import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Min,
  IsNumber
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID of the book to order',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  bookId: number;

  @ApiProperty({
    description: 'Quantity of books to order',
    example: 2
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}
