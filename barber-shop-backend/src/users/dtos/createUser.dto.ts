import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MinLength(50)
  name: string;

  @IsString()
  @MinLength(2)
  @MinLength(50)
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(4)
  @MinLength(50)
  password: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
