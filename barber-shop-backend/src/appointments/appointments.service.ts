import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentEntity } from './entities/appointment.entity';
import { Between, createQueryBuilder, DataSource, Repository } from 'typeorm';
import { CreateAppointmentDto } from './dtos/createAppointment.dto';
import { UsersService } from 'src/users/users.service';
import { ServicesService } from 'src/services/services.service';
import { dayEnd, dayStart, format, isAfter } from '@formkit/tempo';
import { UpdateAppointmentDto } from './dtos/updateAPpointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,
    private readonly usersService: UsersService,
    private readonly servicesService: ServicesService,
  ) {}

  private readonly daysAvailable = [
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
  ];

  private readonly hoursAvailable = [
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
  ];

  async createAppointment({
    userId,
    createAppointmentDto,
  }: {
    userId: number;
    createAppointmentDto: CreateAppointmentDto;
  }) {
    const { password, ...restUserData } = await this.usersService.findById({
      id: userId,
    });

    const service = await this.servicesService.getServiceById(
      createAppointmentDto.serviceId,
    );

    this.validateDate(createAppointmentDto.date);

    const appointmentIsBooked = await this.appointmentRepository.findOneBy({
      date: createAppointmentDto.date,
    });

    if (appointmentIsBooked) {
      throw new BadRequestException('Appointment has already been booked');
    }

    const appointment = this.appointmentRepository.create({
      date: createAppointmentDto.date,
      service,
      user: {
        ...restUserData,
      },
    });

    await this.appointmentRepository.save(appointment);

    return appointment;
  }

  async getHoursAppointmentsAvailableByDate(inputDate: Date) {
    this.validateDate(inputDate);

    const inputDateFormated = new Date(inputDate).toISOString();

    const startDayDate = dayStart(inputDateFormated);
    const endDayDate = dayEnd(inputDateFormated);

    const appointments = await this.appointmentRepository.find({
      where: {
        date: Between(startDayDate, endDayDate),
      },
    });

    if (appointments.length === 0) {
      return this.hoursAvailable;
    }

    const hours = appointments.map((item) => format(item.date, 'HH', 'es'));

    return this.hoursAvailable.filter((item) => !hours.includes(item));
  }

  async getAppointmentById(appointmentId: number) {
    const appointment = await this.appointmentRepository.findOneBy({
      id: appointmentId,
    });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    return appointment;
  }

  async getAppointmentsByUserId(userId: number) {
    const appointments = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .innerJoinAndSelect('appointment.user', 'user')
      .where('user.id = :id', { id: userId })
      .getMany();

    return appointments;
  }

  async deleteAppointment(appointmentId: number, userId: number) {
    const appointment = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .innerJoinAndSelect('appointment.user', 'user')
      .innerJoinAndSelect('appointment.service', 'service')
      .where('user.id = :id', { id: userId })
      .andWhere('appointment.id = :appointmentId', {
        appointmentId: appointmentId,
      })
      .getOne();

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    if (appointment.user.id !== userId) {
      throw new BadRequestException(
        'You are not authorized to delete this appointment',
      );
    }

    await this.appointmentRepository.delete(appointmentId);

    return {
      message: 'Appointment deleted',
    };
  }

  async updateAppointment(
    appointmentId: number,
    userId: number,
    appointmentDto: UpdateAppointmentDto,
  ) {
    const appointment = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .innerJoinAndSelect('appointment.user', 'user')
      .innerJoinAndSelect('appointment.service', 'service')
      .where('user.id = :id', { id: userId })
      .andWhere('appointment.id = :appointmentId', {
        appointmentId: appointmentId,
      })
      .getOne();

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    if (appointment.user.id !== userId) {
      throw new BadRequestException(
        'You are not authorized to update this appointment',
      );
    }

    if (appointmentDto.date) {
      this.validateDate(appointmentDto.date);
    }

    if (appointmentDto.serviceId) {
      await this.servicesService.getServiceById(appointmentDto.serviceId);
    }

    Object.assign(appointment, appointmentDto);

    await this.appointmentRepository.save(appointment);

    return appointment;
  }

  validateDate(date: Date) {
    const isValidDay = this.daysAvailable.includes(format(date, 'dddd', 'es'));

    if (!isValidDay) {
      throw new BadRequestException('Invalid day');
    }

    const isValidHour = this.hoursAvailable.includes(format(date, 'HH', 'es'));

    if (!isValidHour) {
      throw new BadRequestException('Invalid hour');
    }

    const isAfterToday = isAfter(date, new Date().toISOString());

    if (!isAfterToday) {
      throw new BadRequestException('Invalid date');
    }
  }
}
