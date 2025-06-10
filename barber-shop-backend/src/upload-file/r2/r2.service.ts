import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
@Injectable()
export class R2StorageService {
  constructor(
    @Inject('S3_CLIENT') private readonly client: S3Client,
    private readonly configService: ConfigService,
  ) {}

  async upload(body: Express.Multer.File): Promise<string> {
    const BUCKET_NAME = this.configService.get<string>(
      'CLOUDFLARE_R2_BUCKET_NAME',
    );

    const BASE_URL_IMAGE = this.configService.get<string>(
      'CLOUDFLARE_IMAGE_BASE_URL',
    );

    const [fileName] = body.originalname.split('.');

    const extension = path.extname(body.originalname);

    const name = this.parseFileName(fileName);

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${name}${extension}`,
      Body: body.buffer,
      ContentType: `image/${extension.split('.')[1]}`,
      ContentDisposition: 'inline',
    });

    try {
      const response = await this.client.send(command);

      if (response.$metadata.httpStatusCode !== 200) {
        throw new InternalServerErrorException('Error al subir el archivo');
      }

      return `${BASE_URL_IMAGE}/${name}${extension}`;
    } catch (error) {
      console.log(`Error upload  r2stroageService`, error);
      throw new InternalServerErrorException(error);
    }
  }

  async delete(name: string) {
    const BUCKET_NAME = this.configService.get<string>(
      'CLOUDFLARE_R2_BUCKET_NAME',
    );

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: name,
    });

    try {
      const response = await this.client.send(command);

      console.log({ response, name });

      if (response.$metadata.httpStatusCode !== 200) {
        throw new InternalServerErrorException('Error al subir el archivo');
      }
    } catch (error) {
      console.log(`Error upload  r2stroageService`, error);
      throw new InternalServerErrorException(error);
    }
  }

  parseFileName(name: string): string {
    const fileNameParsed = name
      .trim()
      .toLowerCase()
      .replace('/á/g', 'a')
      .replace('/Á/g', 'a')
      .replace('/é/g', 'e')
      .replace('/É/g', 'e')
      .replace('/í/g', 'i')
      .replace('/Í/g', 'i')
      .replace('/ó/g', 'o')
      .replace('/Ó/g', 'o')
      .replace('/ú/g', 'u')
      .replace('/Ú/g', 'u')
      .replace('/ü/g', 'u')
      .replace(/(\W|\s+)/g, '-');

    return fileNameParsed;
  }
}
