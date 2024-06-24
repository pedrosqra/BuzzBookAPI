import {
  IsString,
  MinLength,
  MaxLength
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  name: string;
}
