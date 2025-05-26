import { Module } from '@nestjs/common';

import { UploadFileService } from './upload-file.service';
import { R2Module } from './r2/r2.module';
import { r2Provider } from './r2/r2.provider';

@Module({
  imports: [R2Module],
  providers: [r2Provider, UploadFileService],
  exports: [UploadFileService],
})
export class UploadModule {}
