import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class LoginDto {
  @IsEmail()
  @IsNotEmpty({
    message: 'El email no puede estar vacío',
  })
  email: string;

  @IsString()
  @MinLength(8, {
    message: 'La contraseña debe tener al menos 8 caracteres',
  })
  password: string;
}
