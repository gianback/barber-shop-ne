import { ConfigModule } from '@nestjs/config';

export const envs = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: ['.env'],
});
