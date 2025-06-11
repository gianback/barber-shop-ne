import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UploadFileService } from 'src/upload-file/upload-file.service';
import { R2StorageService } from 'src/upload-file/r2/r2.service';
import { r2Provider } from 'src/upload-file/r2/r2.provider';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    JwtStrategy,
    UploadFileService,
    R2StorageService,
    r2Provider,
  ],
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
  ],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
