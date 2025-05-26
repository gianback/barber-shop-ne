import { IsNumber, IsOptional } from 'class-validator';

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
  password?: string;

  @IsOptional()
  avatar?: string;
}
