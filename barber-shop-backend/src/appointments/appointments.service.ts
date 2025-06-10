import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentEntity } from './entities/appointment.entity';
import { Between, Equal, Repository } from 'typeorm';
import { CreateAppointmentDto } from './dtos/createAppointment.dto';
import { UsersService } from 'src/users/users.service';
import { ServicesService } from 'src/services/services.service';
import { addHour, dayEnd, dayStart, format, isAfter } from '@formkit/tempo';
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
    {
      hour: '09',
    },
    {
      hour: '10',
    },
    {
      hour: '11',
    },
    {
      hour: '12',
    },
    {
      hour: '13',
    },
    {
      hour: '14',
    },
    {
      hour: '15',
    },
    {
      hour: '16',
    },
    {
      hour: '17',
    },
    {
      hour: '18',
    },
  ];

  getSchedule(date: Date) {
    const iso = dayStart(date);

    const schedule = this.hoursAvailable.map((item) => {
      return {
        hour: item.hour,
        iso: addHour(iso, Number(item.hour)),
      };
    });

    return schedule;
  }
  async createAppointment({
    userId,
    createAppointmentDto,
  }: {
    userId: number;
    createAppointmentDto: CreateAppointmentDto;
  }) {
    try {
      const { password, ...restUserData } = await this.usersService.findById({
        id: userId,
      });

      const service = await this.servicesService.getServiceById(
        createAppointmentDto.serviceId,
      );

      this.validateHour(createAppointmentDto.date);

      this.validateValidDate(createAppointmentDto.date);

      this.validateDay(createAppointmentDto.date);

      const appointmentIsBooked = await this.appointmentRepository.findOneBy({
        date: createAppointmentDto.date,
      });

      if (appointmentIsBooked) {
        throw new BadRequestException('Esta fecha ya esta reservada');
      }

      const appointment = this.appointmentRepository.create({
        date: createAppointmentDto.date,
        service,
        user: {
          ...restUserData,
        },
      });

      await this.appointmentRepository.save(appointment);

      return {
        success: true,
        appointment,
        message: 'Cita reservada correctamente',
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message,
      };
    }
  }

  async getHoursAppointmentsAvailableByDate(inputDate: Date) {
    this.validateDay(inputDate);

    this.validateValidDate(inputDate);

    const inputDateFormated = inputDate;

    const startDayDate = dayStart(inputDateFormated);
    const endDayDate = dayEnd(inputDateFormated);

    const appointments = await this.appointmentRepository.find({
      where: {
        date: Between(startDayDate, endDayDate),
      },
    });

    if (appointments.length === 0) {
      return this.getSchedule(inputDate);
    }

    const hours = appointments.map((item) => format(item.date, 'HH', 'es'));
    const schedule = this.getSchedule(inputDate);

    return schedule.filter((item) => !hours.includes(item.hour));
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
      .innerJoin('appointment.user', 'user')
      .addSelect(['user.id'])
      .innerJoin('appointment.service', 'service')
      .addSelect(['service.id', 'service.name'])
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
      message: 'Cita borrada correctamente',
      success: true,
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
      this.validateHour(appointmentDto.date);
      this.validateValidDate(appointmentDto.date);
      this.validateDay(appointmentDto.date);
    } else {
      throw new BadRequestException('Please provide a date');
    }

    if (appointmentDto.serviceId) {
      await this.servicesService.getServiceById(appointmentDto.serviceId);
    }

    //validar que la fecha que viene no este booked

    const isoInputDate = new Date(appointmentDto.date).toISOString();

    const appointmentBooked = await this.appointmentRepository.find({
      where: {
        date: Equal(new Date(isoInputDate)),
      },
    });

    if (appointmentBooked.length > 0) {
      throw new BadRequestException('Appointment has already been booked');
    }

    Object.assign(appointment, appointmentDto);

    await this.appointmentRepository.save(appointment);

    return {
      success: true,
      appointment,
      message: 'Cita actualizada correctamente',
    };
  }

  validateValidDate(date: Date) {
    const isAfterToday = isAfter(date, new Date().toISOString());

    if (!isAfterToday) {
      throw new BadRequestException('Invalid date');
    }
  }

  validateDay(date: Date) {
    const isValidDay = this.daysAvailable.includes(format(date, 'dddd', 'es'));

    if (!isValidDay) {
      throw new BadRequestException('Invalid day');
    }
  }

  validateHour(date: Date) {
    const isValidHour = this.hoursAvailable.some(
      (item) => item.hour === format(date, 'HH', 'es'),
    );

    if (!isValidHour) {
      throw new BadRequestException('Invalid hour');
    }
  }
}
