import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}
  transform(value: unknown, _metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value) as UserEntity;

      return parsedValue;
    } catch (error: any) {
      if (error instanceof ZodError) {
        throw new BadRequestException(error.issues[0].message);
      }

      throw new Error('Invalid input');
    }
  }
}
