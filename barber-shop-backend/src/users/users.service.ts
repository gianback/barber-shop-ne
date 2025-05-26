import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { GeneralResponse } from 'src/interfaces/responses.interface';
import { CreateUserDto } from './dtos/createUser.dto';
import { FindByIdDto } from './dtos/findbyId.dto';
import { FindByEmailDto } from './dtos/findByEmail.dto';
import { EditUserDto } from './dtos/editUser.dto';
import { ConfigService } from '@nestjs/config';
import { FindAllUsers } from './interfaces/findAllUsers.interface';
import { AdminCreated } from './interfaces/adminCreated.interface';
import { UploadFileService } from 'src/upload-file/upload-file.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly coonfigService: ConfigService,
    private readonly uploadFileService: UploadFileService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { password, ...userData } = createUserDto;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = this.userRepository.create({
        ...userData,
        password: hashedPassword,
      });

      await this.userRepository.save(user);

      return user;
    } catch (error: any) {
      if (error.code === '23505') {
        throw new BadRequestException(
          `Email ${createUserDto.email} already exists`,
        );
      }

      throw new BadRequestException('Invalid data');
    }
  }

  async createAdmin(
    createUserDto: CreateUserDto,
    key: string,
  ): Promise<AdminCreated> {
    const VERIFY_TOKEN_FOR_CREATE_ADMIN = this.coonfigService.get(
      'VERIFY_TOKEN_FOR_CREATE_ADMIN',
    ) as string;

    const isValidAdminToken = VERIFY_TOKEN_FOR_CREATE_ADMIN === key;

    if (!isValidAdminToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        role: UserRole.admin,
      });

      await this.userRepository.save(user);

      const { password: _password, ...restData } = user;

      return restData;
    } catch (error: any) {
      if (error.code === '23505') {
        throw new BadRequestException(
          `Email ${createUserDto.email} already exists`,
        );
      }

      throw new BadRequestException('Invalid data');
    }
  }

  async findById(findByIdDto: FindByIdDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: findByIdDto.id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(findByEmailDto: FindByEmailDto): Promise<UserEntity> {
    const user = (await this.userRepository.findOne({
      where: { email: findByEmailDto.email },
    })) as UserEntity;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async editUser(editUserDto: EditUserDto): Promise<GeneralResponse> {
    const user = await this.userRepository.findOne({
      where: { id: editUserDto.id },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    Object.assign(user, editUserDto);

    await this.userRepository.save(user);

    return { message: 'User was updated', status: 200 };
  }

  async delete({ id }: { id: number }): Promise<GeneralResponse> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.userRepository.delete({ id });

    return { message: 'User deleted', status: 200 };
  }

  async findAll(): Promise<FindAllUsers[]> {
    const users = await this.userRepository.find();

    const usersWithoutPwd = users.map((user) => {
      const { password, ...restData } = user;

      return restData;
    });

    return usersWithoutPwd;
  }

  async updateAvatarUser(
    File: Express.Multer.File,
    id: number,
  ): Promise<{ url: string }> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const url = await this.uploadFileService.uploadFile(File);

    return {
      url,
    };
  }
}
