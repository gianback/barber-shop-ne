import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  last_name: string;

  @IsString()
  @MaxLength(9)
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @MinLength(4)
  @MaxLength(50)
  password: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
