import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { GeneralResponse } from 'src/interfaces/responses.interface';
import { CreateUserDto } from './dtos/createUser.dto';
import { FindByIdDto } from './dtos/findbyId.dto';
import { FindByEmailDto } from './dtos/findByEmail.dto';
import { EditUserDto } from './dtos/editUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
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
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(
          `Email ${createUserDto.email} already exists`,
        );
      }

      throw new BadRequestException('Invalid data');
    }
  }

  // async createAdmin(createUserDto: CreateUserDto): Promise<UserEntity> {}

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

    console.log({ user, findByEmailDto });

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

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }
}
