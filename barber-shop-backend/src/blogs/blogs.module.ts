import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { UsersService } from 'src/users/users.service';
import { UploadFileService } from 'src/upload-file/upload-file.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserEntity } from 'src/users/entities/user.entity';
import { r2Provider } from 'src/upload-file/r2/r2.provider';
import { R2StorageService } from 'src/upload-file/r2/r2.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity, UserEntity]), AuthModule],
  providers: [
    BlogsService,
    UsersService,
    r2Provider,
    R2StorageService,
    UploadFileService,
  ],
  controllers: [BlogsController],
  exports: [BlogsService],
})
export class BlogsModule {}
