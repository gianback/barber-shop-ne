import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { envs } from './config/envs';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';
import { pool } from './config/db';

@Module({
  imports: [envs, pool, UsersModule],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSoure: DataSource) {}
}
