import { IsString, MinLength } from 'class-validator';
export class CreateBlogDto {
  @IsString()
  @MinLength(2)
  @MinLength(50)
  title: string;

  @IsString()
  @MinLength(2)
  @MinLength(50)
  description: string;
}
