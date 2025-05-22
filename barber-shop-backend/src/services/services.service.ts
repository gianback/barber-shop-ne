import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { ServiceEntity } from './entities/services.entity';
import { GeneralResponse } from 'src/interfaces/responses.interface';
import { CreateServiceProps } from './interfaces/create-service';
import { UserEntity, UserRole } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly servicesRepositoy: Repository<ServiceEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createService({
    service,
    userId,
    image,
  }: CreateServiceProps): Promise<GeneralResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (user === null) {
      throw new BadRequestException('User not found');
    }

    const isAdmin = user.role === UserRole.admin;

    if (!isAdmin) {
      throw new UnauthorizedException('User not authorized');
    }

    return { message: 'Service created', status: 200 };
  }

  async getAllServices(): Promise<ServiceEntity[]> {
    return await this.servicesRepositoy.find();
  }
}
