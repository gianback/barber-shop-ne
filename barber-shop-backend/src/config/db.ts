import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

export const pool = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: config.get('DB_HOST'),
    port: config.get('DB_PORT'),
    username: config.get('DB_USER'),
    password: config.get('DB_PASSWORD'),
    database: config.get('DB_DATABASE'),
    migrations: ['src/database/migrations/**'],
    synchronize: process.env.NODE_ENV !== 'production',
    autoLoadEntities: true,
  }),
  inject: [ConfigService],
});
