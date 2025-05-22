import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
export const r2Provider = {
  provide: 'S3_CLIENT',
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const accessKeyId = config.get<string>('CLOUDFLARE_ACCESS_ID');
    const accessSecretKey =
      config.get<string>('CLOUDFLARE_ACCESS_SECRET_KEY') || '';
    const accountId = config.get<string>('CLOUDFLARE_ACCOUNT_ID');

    const hashedScretKey = createHash('sha256')
      .update(accessSecretKey)
      .digest('hex');

    return new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId || '',
        secretAccessKey: hashedScretKey,
      },
    });
  },
};
