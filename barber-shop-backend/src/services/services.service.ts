import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { ServiceEntity } from './entities/services.entity';
import { CreateServiceProps } from './interfaces/create-service';
import { UserRole } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { UploadFileService } from 'src/upload-file/upload-file.service';
import { UpdateServiceDto } from './dtos/updateService.dto';
import slugify from 'slugify';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly servicesRepository: Repository<ServiceEntity>,
    private readonly usersService: UsersService,
    private readonly uploadFileService: UploadFileService,
  ) {}

  async createService({
    service,
    userId,
    image,
  }: CreateServiceProps): Promise<ServiceEntity | string> {
    const user = await this.usersService.findById({ id: userId });

    if (user === null) {
      throw new BadRequestException('User not found');
    }

    const isAdmin = user.role === UserRole.admin;

    if (!isAdmin) {
      throw new UnauthorizedException('User not authorized');
    }

    const isMoreThan1MB = image.size > 1048576;

    if (isMoreThan1MB)
      throw new BadRequestException('Image size must be less than 1MB');

    const parsedName = this.uploadFileService.parseFileName(image);

    const slug = await this.parseNameToSlug(parsedName);

    try {
      const imageUrl = await this.uploadFileService.uploadFile(image);

      const serviceCreated = this.servicesRepository.create({
        ...service,
        image: imageUrl,
        name: parsedName,
        slug,
      });

      const newService = await this.servicesRepository.save(serviceCreated);

      console.log('new services was created successfully');

      return newService;
    } catch (error) {
      console.log('error creando el servicio en createService', error);
      throw new InternalServerErrorException();
    }
  }

  async updateService({
    updateServiceDto,
    userId,
  }: {
    updateServiceDto: UpdateServiceDto;
    userId: number;
  }) {
    const user = await this.usersService.findById({ id: userId });

    if (user === null) {
      throw new BadRequestException('User not found');
    }

    const isAdmin = user.role === UserRole.admin;

    if (!isAdmin) {
      throw new UnauthorizedException('User not authorized');
    }

    const service = await this.servicesRepository.findOne({
      where: { id: updateServiceDto.id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    Object.assign(service, updateServiceDto);
  }

  async deleteService({ id, userId }: { id: number; userId: number }) {
    const user = await this.usersService.findById({ id: userId });

    if (user === null) {
      throw new BadRequestException('User not found');
    }

    const isAdmin = user.role === UserRole.admin;

    if (!isAdmin) {
      throw new UnauthorizedException('User not authorized');
    }

    const service = await this.servicesRepository.findOne({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    await this.servicesRepository.delete({ id });
  }

  async getAllServices(): Promise<ServiceEntity[]> {
    return await this.servicesRepository.find();
  }

  async parseNameToSlug(name: string) {
    const baseSlug = slugify(name, { lower: true, strict: true });
    let newSlug = baseSlug;
    let counter = 1;

    const existsSlug = await this.servicesRepository.findOne({
      where: { slug: baseSlug },
    });

    while (existsSlug) {
      newSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    return newSlug;
  }
}
