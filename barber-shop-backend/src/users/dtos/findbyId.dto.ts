import { IsNumber } from 'class-validator';

export class FindByIdDto {
  @IsNumber()
  id: number;
}
