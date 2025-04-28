import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity, UserRole } from './entities/user.entity';
import { hash } from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';

interface User {
  name: string;
  last_name: string;
  email: string;
  password: string;
  avatar: string;
}

export interface GeneralResponse {
  message: string;
  status: number;
}

type UserPatch = Partial<User>;

export type UserResponse = Omit<UserEntity, 'password'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create({
    user,
    key,
  }: {
    user: User;
    key?: string;
  }): Promise<UserResponse> {
    const { avatar, email, last_name, name, password } = user;

    const userAlreadyExists = await this.userRepository.findOne({
      where: { email },
    });
    if (userAlreadyExists) {
      throw new BadRequestException('User already exists');
    }

    let isAdmin: boolean = false;
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    if (key) {
      if (key !== VERIFY_TOKEN) {
        console.log({
          key,
          VERIFY_TOKEN,
        });

        throw new UnauthorizedException('Unauthorized');
      }
      isAdmin = true;
    }

    const hashedPassword = await hash(password, 10);

    const newUser = this.userRepository.create({
      avatar,
      email,
      last_name,
      name,
      password: hashedPassword,
      role: isAdmin ? UserRole.admin : UserRole.user,
    });

    return await this.userRepository.save({
      id: newUser.id,
      avatar: newUser.avatar,
      email: newUser.email,
      last_name: newUser.last_name,
      name: newUser.name,
      role: newUser.role,
    });
  }

  async findOne({ id }: { id: number }): Promise<UserResponse> {
    const {
      email,
      avatar,
      id: userId,
      last_name,
      name,
      role,
    } = (await this.userRepository.findOne({
      where: { id },
    })) as UserEntity;

    return {
      email,
      avatar,
      id: userId,
      last_name,
      name,
      role,
    };
  }

  async editUser({
    id,
    payload,
  }: {
    id: number;
    payload: UserPatch;
  }): Promise<GeneralResponse> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    Object.assign(user, payload);

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
