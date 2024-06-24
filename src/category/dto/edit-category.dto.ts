import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength
} from 'class-validator';

export class EditCategoryDto {
  @ApiProperty({
    description: 'New name of the category'
  })
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  name: string;
}
