import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { AppointmentEntity } from './entities/appointment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ServiceEntity } from 'src/services/entities/services.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppointmentEntity, ServiceEntity, UserEntity]),
    AuthModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
