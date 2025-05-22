import { Module } from '@nestjs/common';
import { r2Provider } from './r2.provider';
import { R2StorageService } from './r2.service';

@Module({
  providers: [r2Provider],
  exports: [R2StorageService],
})
export class R2Module {}
