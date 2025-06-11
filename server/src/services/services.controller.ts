import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  UseGuards,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ServicesDto } from './dtos/services.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/getUser.decorator';
import { UpdateServiceDto } from './dtos/updateService.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('image'))
  async createService(
    @GetUser('id') userId: number,
    @Body() service: ServicesDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.servicesService.createService({
      service,
      image: file,
      userId,
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  async updateService(
    @Body() updateServiceDto: UpdateServiceDto,
    @GetUser('id') userId: number,
    @Param('id') id: number,
  ) {
    return await this.servicesService.updateService({
      userId,
      updateServiceDto,
      id,
    });
  }

  @Patch('/image/:id')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('image'))
  async updateServiceImage(
    @GetUser('id') userId: number,
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.servicesService.updateServiceImage({
      userId,
      id,
      file,
    });
  }

  @Get()
  // @UseGuards(AuthGuard())
  getAllServices() {
    return this.servicesService.getAllServices();
  }

  @Get(':id')
  getServiceById(@Param('id') id: number) {
    return this.servicesService.getServiceById(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteService(@Param('id') id: number, @GetUser('id') userId: number) {
    return await this.servicesService.deleteService({
      id,
      userId,
    });
  }
}
