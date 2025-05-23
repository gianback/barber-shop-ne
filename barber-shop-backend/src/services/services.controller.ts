import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  Get,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ServicesDto } from './dtos/services.dto';
import { RequestWithSession } from 'src/middlewares/session.middleware';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createService(
    @Req() req: RequestWithSession,
    @Body() service: ServicesDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    //validar el roll del usuario
    //todo validate token para del usuario admin en los headers
    //proceder con todo
    const userId = req.user.id;

    return await this.servicesService.createService({
      service,
      image: file,
      userId,
    });
  }
  @Get()
  getAllServices() {
    return this.servicesService.getAllServices();
  }
}
