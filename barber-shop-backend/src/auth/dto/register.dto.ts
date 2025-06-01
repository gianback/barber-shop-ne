import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3, {
    message: 'El nombre debe tener al menos 3 caracteres',
  })
  @MaxLength(255)
  name: string;

  @Transform(({ value }: { value: string }) => value.trim())
  @IsString()
  @MinLength(3, {
    message: 'El apellido debe tener al menos 3 caracteres',
  })
  @MaxLength(255, {
    message: 'El apellido no puede tener mas de 255 caracteres',
  })
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(9, {
    message: 'El numero de telefono no puede tener mas de 9 caracteres',
  })
  phone: string;

  @IsString()
  @MinLength(8, {
    message: 'La contraseña debe tener al menos 8 caracteres',
  })
  @MaxLength(255)
  password: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
