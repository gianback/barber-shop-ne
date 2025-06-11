import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { GeneralResponse } from 'src/interfaces/responses.interface';
import { EditUserDto } from './dtos/editUser.dto';
import { FindAllUsers } from './interfaces/findAllUsers.interface';
import { AdminCreated } from './interfaces/adminCreated.interface';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/services/decorators/getUser.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<FindAllUsers[]> {
    return await this.usersService.findAll();
  }

  @Get('me')
  @UseGuards(AuthGuard())
  async findMe(@GetUser('id') userId: number) {
    return await this.usersService.findMe(userId);
  }
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<UserEntity> {
    return await this.usersService.findById({ id });
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.usersService.createUser(createUserDto);
  }

  @Post('admin')
  async createAdmin(
    @Body() createUserDto: CreateUserDto,
    @Headers('authorization') key?: string,
  ): Promise<AdminCreated> {
    const keyParsed = key || '';

    return await this.usersService.createAdmin(createUserDto, keyParsed);
  }

  @Patch(':id')
  async editUser(@Body() payload: EditUserDto): Promise<GeneralResponse> {
    return await this.usersService.editUser(payload);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<GeneralResponse> {
    return await this.usersService.delete({ id });
  }
}
