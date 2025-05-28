import { IsISO8601, IsNumber } from 'class-validator';

export class UpdateAppointmentDto {
  @IsISO8601()
  date?: Date;

  @IsNumber()
  serviceId?: number;
}
