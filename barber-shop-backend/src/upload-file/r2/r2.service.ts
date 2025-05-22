// src/storage/s3/s3-storage.service.ts
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class R2StorageService {
  constructor(
    @Inject('S3_CLIENT') private readonly client: S3Client,
    private readonly configService: ConfigService,
  ) {}

  async upload(body: Express.Multer.File): Promise<string> {
    const BUCKET_NAME = this.configService.get<string>(
      'CLOUDFLARE_BUCKET_NAME',
    );

    const BASE_URL_IMAGE = this.configService.get<string>(
      'CLOUDFLARE_IMAGE_BASE_URL',
    );

    const name = body.originalname;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: name,
      Body: body.stream,
    });

    try {
      const response = await this.client.send(command);

      if (response.$metadata.httpStatusCode !== 200) {
        throw new InternalServerErrorException('Error al subir el archivo');
      }

      return `${BASE_URL_IMAGE}/${name}`;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
