import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { AppointmentEntity } from './entities/appointment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ServiceEntity } from 'src/services/entities/services.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { ServicesService } from 'src/services/services.service';
import { UsersService } from 'src/users/users.service';
import { UploadFileService } from 'src/upload-file/upload-file.service';
import { r2Provider } from 'src/upload-file/r2/r2.provider';
import { R2StorageService } from 'src/upload-file/r2/r2.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppointmentEntity, ServiceEntity, UserEntity]),
    AuthModule,
  ],
  controllers: [AppointmentsController],
  providers: [
    AppointmentsService,
    ServicesService,
    UsersService,
    UploadFileService,
    R2StorageService,
    r2Provider,
  ],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
