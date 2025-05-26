import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UploadModule } from 'src/upload-file/upload-file.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UploadModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
