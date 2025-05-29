import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { envs } from './config/envs';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';
import { pool } from './config/db';
import { BlogsController } from './blogs/blogs.controller';
import { BlogsModule } from './blogs/blogs.module';
import { ServicesModule } from './services/services.module';
import { ServicesController } from './services/services.controller';
import { AuthModule } from './auth/auth.module';
import { AppointmentsController } from './appointments/appointments.controller';
import { AppointmentsModule } from './appointments/appointments.module';

@Module({
  imports: [
    envs,
    pool,
    UsersModule,
    BlogsModule,
    ServicesModule,
    AppointmentsModule,
    AuthModule,
  ],
  controllers: [
    UsersController,
    BlogsController,
    ServicesController,
    AppointmentsController,
  ],
})
export class AppModule {
  constructor(private dataSoure: DataSource) {}
}
