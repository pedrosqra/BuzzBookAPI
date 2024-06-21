import {
  IsString,
  IsNotEmpty,
  IsOptional
} from 'class-validator';

export class EditCategoryDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}
