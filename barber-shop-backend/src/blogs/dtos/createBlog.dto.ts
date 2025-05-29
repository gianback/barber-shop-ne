import { IsString, MaxLength, MinLength } from 'class-validator';
export class CreateBlogDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  title: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  description: string;
}
