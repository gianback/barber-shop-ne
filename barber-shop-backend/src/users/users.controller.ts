import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateCatDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(200)
  async findAll(): Promise<string> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: number): Promise<string> {
    return await this.usersService.findOne({ id });
  }

  @Post()
  @HttpCode(201)
  async create(@Body() user: CreateCatDto): Promise<string> {
    return await this.usersService.create({
      user,
    });
  }

  @Patch(':id')
  @HttpCode(200)
  async editUser(
    @Param('id') id: number,
    @Body() payload: UpdateUserDto,
  ): Promise<string> {
    return await this.usersService.editUser({
      id,
      payload,
    });
  }
}
