import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogEntity } from './entities/blog.entity';
import { CreateBlogDto } from './dtos/createBlog.dto';
import { GeneralResponse } from 'src/interfaces/responses.interface';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/services/decorators/getUser.decorator';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsServices: BlogsService) {}

  @Get()
  async findAll(): Promise<BlogEntity[]> {
    return await this.blogsServices.findAll();
  }

  @Post()
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @GetUser('id') userId: number,
    @Body() blog: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ success: boolean; blog: BlogEntity }> {
    return await this.blogsServices.createPost({
      blog,
      image: file,
      userId,
    });
  }

  @Get(':id')
  async findeOnePost(@Param('id') id: string): Promise<BlogEntity> {
    return await this.blogsServices.findOne({ id: +id });
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  async updatePost(
    @Param('id') id: number,
    @Body() blog: Partial<BlogEntity>,
    @GetUser('id') userId: number,
  ): Promise<{ success: boolean; blog: BlogEntity }> {
    return await this.blogsServices.updatePost({
      id,
      blog,
      userId,
    });
  }

  @Patch('/image/:id')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('image'))
  async updateImagePost(
    @GetUser('id') userId: number,
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.blogsServices.updateImageBlog({ id, file, userId });
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async deletePost(
    @Param('id') id: number,
    @GetUser('id') userId: number,
  ): Promise<GeneralResponse> {
    return await this.blogsServices.deletePost({ id, userId });
  }
}
