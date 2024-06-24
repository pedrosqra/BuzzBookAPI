import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Name of the category'
  })
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  name: string;
}
