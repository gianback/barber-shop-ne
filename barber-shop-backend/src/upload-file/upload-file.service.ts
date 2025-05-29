import { Injectable } from '@nestjs/common';
import { R2StorageService } from './r2/r2.service';
@Injectable()
export class UploadFileService {
  constructor(private r2StorageService: R2StorageService) {}

  async uploadFile(file: Express.Multer.File) {
    return this.r2StorageService.upload(file);
  }

  async deleteFile(name: string) {
    return await this.r2StorageService.delete(name);
  }
}
