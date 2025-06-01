import { IsNumber, IsOptional, MaxLength } from 'class-validator';

export class EditUserDto {
  @IsNumber()
  id: number;

  @IsOptional()
  name?: string;

  @IsOptional()
  last_name?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  @MaxLength(9)
  phone?: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  avatar?: string;
}
