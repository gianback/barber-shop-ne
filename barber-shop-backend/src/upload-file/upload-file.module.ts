import { Module } from '@nestjs/common';

import { UploadFileService } from './upload-file.service';
import { R2Module } from './r2/r2.module';

@Module({
  imports: [R2Module],
  // providers: [UploadFileService],
  exports: [UploadFileService],
})
export class UploadModule {}
