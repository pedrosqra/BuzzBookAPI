import {
  IsNotEmpty,
  Min,
  IsNumber
} from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  bookId: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}
