import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UploadFileService } from 'src/upload-file/upload-file.service';
import { R2StorageService } from 'src/upload-file/r2/r2.service';
import { r2Provider } from 'src/upload-file/r2/r2.provider';
import { AuthModule } from 'src/auth/auth.module';
import { ServiceEntity } from './entities/services.entity';
import { AppointmentEntity } from 'src/appointments/entities/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceEntity, UserEntity, AppointmentEntity]),
    AuthModule,
  ],
  providers: [
    ServicesService,
    UsersService,
    UploadFileService,
    R2StorageService,
    r2Provider,
  ],
  controllers: [ServicesController],
  exports: [ServicesService],
})
export class ServicesModule {}
