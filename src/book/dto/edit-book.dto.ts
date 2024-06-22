import {
  IsString,
  IsOptional,
  IsNumber,
  IsCurrency,
  IsNotEmpty
} from 'class-validator';

export class EditBookDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsCurrency()
  price?: number;
}
