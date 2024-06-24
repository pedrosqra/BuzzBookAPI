import {
  IsString,
  MinLength,
  MaxLength
} from 'class-validator';

export class EditCategoryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  name: string;
}
