import { IsISO8601, IsNumber } from 'class-validator';

export class CreateAppointmentDto {
  @IsISO8601()
  date: Date;

  @IsNumber()
  serviceId: number;
}
