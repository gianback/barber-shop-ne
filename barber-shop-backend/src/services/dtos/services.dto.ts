import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
export class ServicesDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  description: string;

  @IsNotEmpty()
  price: number;
}
