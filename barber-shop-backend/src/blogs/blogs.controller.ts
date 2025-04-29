import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogEntity } from './entities/blog.entity';
import { GeneralResponse } from 'src/users/users.service';
import { CreateBlogDto } from './dtos/createBlog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsServices: BlogsService) {}

  @Get()
  async findAll(): Promise<BlogEntity[]> {
    return await this.blogsServices.findAll();
  }

  @Post()
  async createPost(@Body() blog: CreateBlogDto): Promise<GeneralResponse> {
    return await this.blogsServices.createPost({
      blog,
    });
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string): Promise<BlogEntity> {
    return await this.blogsServices.findOne({ slug });
  }

  @Patch(':id')
  async updatePost(
    @Param('id') id: number,
    @Body() payload: Partial<BlogEntity>,
  ): Promise<GeneralResponse> {
    return await this.blogsServices.updatePost({
      id,
      payload,
    });
  }

  @Delete(':id')
  async deletePost(@Param('id') id: number): Promise<GeneralResponse> {
    return await this.blogsServices.deletePost({ id });
  }
}
