import {
  IsNotEmpty,
  Min,
  IsNumber
} from 'class-validator';

export class EditOrderDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}
