import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { StripeProvider } from './stripe.provider';
import { ServicesService } from 'src/services/services.service';
import { ServiceEntity } from 'src/services/entities/services.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { UploadFileService } from 'src/upload-file/upload-file.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { R2StorageService } from 'src/upload-file/r2/r2.service';
import { r2Provider } from 'src/upload-file/r2/r2.provider';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { AppointmentEntity } from 'src/appointments/entities/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceEntity, UserEntity, AppointmentEntity]),
    ConfigModule,
  ],
  providers: [
    StripeService,
    StripeProvider,
    ServicesService,
    UsersService,
    UploadFileService,
    R2StorageService,
    r2Provider,
    AppointmentsService,
  ],
  exports: [StripeService, StripeProvider],
})
export class StripeModule {}
