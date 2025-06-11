import { Module } from '@nestjs/common';
import { r2Provider } from './r2.provider';
import { R2StorageService } from './r2.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [R2StorageService, r2Provider],
  exports: [R2StorageService, r2Provider],
})
export class R2Module {}
