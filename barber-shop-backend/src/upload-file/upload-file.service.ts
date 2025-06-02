import { Injectable } from '@nestjs/common';
import { R2StorageService } from './r2/r2.service';
@Injectable()
export class UploadFileService {
  constructor(private r2StorageService: R2StorageService) {}

  async uploadFile(image: Express.Multer.File) {
    return this.r2StorageService.upload(image);
  }

  async deleteFile(key: string) {
    return await this.r2StorageService.delete(key);
  }
}
