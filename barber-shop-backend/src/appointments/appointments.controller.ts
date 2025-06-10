import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dtos/createAppointment.dto';
import { AuthGuard } from '@nestjs/passport';
import { AppointmentsService } from './appointments.service';
import { GetUser } from 'src/services/decorators/getUser.decorator';
import { UpdateAppointmentDto } from './dtos/updateAPpointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @UseGuards(AuthGuard())
  createAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @GetUser('id') userId: number,
  ) {
    return this.appointmentsService.createAppointment({
      userId,
      createAppointmentDto,
    });
  }

  @Get('date/:date')
  getHoursAppointmentsAvailableByDate(@Param('date') date: Date) {
    return this.appointmentsService.getHoursAppointmentsAvailableByDate(date);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard())
  getAppointmentsByUserId(@Param('userId') userId: number) {
    return this.appointmentsService.getAppointmentsByUserId(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  getAppointmentById(@Param('id') appointmentId: number) {
    return this.appointmentsService.getAppointmentById(appointmentId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  updateAppointment(
    @GetUser('id') userId: number,
    @Param('id') appointmentId: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.updateAppointment(
      appointmentId,
      userId,
      updateAppointmentDto,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  deleteAppointment(
    @GetUser('id') userId: number,
    @Param('id') appointmentId: number,
  ) {
    return this.appointmentsService.deleteAppointment(appointmentId, userId);
  }
}
