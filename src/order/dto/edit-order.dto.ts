import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Min,
  IsNumber
} from 'class-validator';

export class EditOrderDto {
  @ApiProperty({
    description: 'New quantity of books',
    example: 3
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}
