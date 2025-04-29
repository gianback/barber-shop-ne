import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { envs } from './config/envs';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';
import { pool } from './config/db';
import { BlogsController } from './blogs/blogs.controller';
import { BlogsModule } from './blogs/blogs.module';

@Module({
  imports: [envs, pool, UsersModule, BlogsModule],
  controllers: [AppController, UsersController, BlogsController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSoure: DataSource) {}
}
