import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { CreateCatDto, createUserSchema } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { GeneralResponse, UserResponse, UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<UserResponse> {
    return await this.usersService.findOne({ id });
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(
    @Body() user: CreateCatDto,
    @Headers('authorization') key?: string,
  ): Promise<UserResponse> {
    return await this.usersService.create({
      user,
      key,
    });
  }

  @Patch(':id')
  async editUser(
    @Param('id') id: number,
    @Body() payload: UpdateUserDto,
  ): Promise<GeneralResponse> {
    return await this.usersService.editUser({
      id,
      payload,
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<GeneralResponse> {
    return await this.usersService.delete({ id });
  }
}
