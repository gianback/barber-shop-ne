import { IsNumber } from 'class-validator';

export class CreateCheckoutSessionDto {
  @IsNumber()
  serviceId: number;

  @IsNumber()
  appointmentId: number;
}
