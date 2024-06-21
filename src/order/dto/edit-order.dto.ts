import {
  IsNotEmpty,
  Min,
  IsNumber,
  IsString
} from 'class-validator';

export class EditOrderDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  status: string;
}
