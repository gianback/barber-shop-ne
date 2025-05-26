import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dtos/createBlog.dto';
import slugify from 'slugify';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GeneralResponse } from 'src/interfaces/responses.interface';
import { UsersService } from 'src/users/users.service';
import { UploadFileService } from 'src/upload-file/upload-file.service';
import { UserRole } from 'src/users/entities/user.entity';

export type PatchBlog = Partial<BlogEntity>;

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    private readonly usersService: UsersService,
    private readonly uploadFileService: UploadFileService,
  ) {}

  async createPost({
    blog,
    image,
    userId,
  }: {
    blog: CreateBlogDto;
    image: Express.Multer.File;
    userId: number;
  }): Promise<BlogEntity> {
    const user = await this.usersService.findById({ id: userId });

    if (user === null) {
      throw new BadRequestException('User not found');
    }

    const isAdmin = user.role === UserRole.admin;

    if (!isAdmin) {
      throw new UnauthorizedException('User not authorized');
    }

    const baseSlug = slugify(blog.title, { lower: true, strict: true });
    let newSlug = baseSlug;
    let counter = 1;

    const existsSlug = await this.blogRepository.findOne({
      where: { slug: baseSlug },
    });

    while (existsSlug) {
      newSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const urlImage = await this.uploadFileService.uploadFile(image);

    const newBlog = this.blogRepository.create({
      description: blog.description,
      image: urlImage,
      title: blog.title,
      slug: newSlug,
    });

    const blogCreated = await this.blogRepository.save(newBlog);

    return blogCreated;
  }

  async deletePost({
    id,
    userId,
  }: {
    id: number;
    userId: number;
  }): Promise<GeneralResponse> {
    const user = await this.usersService.findById({ id: userId });

    if (user === null) {
      throw new BadRequestException('User not found');
    }

    const isAdmin = user.role === UserRole.admin;

    if (!isAdmin) {
      throw new UnauthorizedException('User not authorized');
    }

    const post = await this.blogRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    await this.blogRepository.delete({ id });

    return { message: 'Post deleted', status: 200 };
  }

  async findAll(): Promise<BlogEntity[]> {
    return await this.blogRepository.find();
  }

  async findOne({ slug }: { slug: string }): Promise<BlogEntity> {
    const post = await this.blogRepository.findOne({
      where: { slug },
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    return post;
  }

  async updatePost({
    id,
    blog,
    userId,
  }: {
    id: number;
    blog: PatchBlog;
    userId: number;
  }): Promise<GeneralResponse> {
    const user = await this.usersService.findById({ id: userId });

    if (user === null) {
      throw new BadRequestException('User not found');
    }

    const isAdmin = user.role === UserRole.admin;

    if (!isAdmin) {
      throw new UnauthorizedException('User not authorized');
    }

    const post = await this.blogRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    Object.assign(post, blog);

    await this.blogRepository.save(post);

    return { message: 'Post updated', status: 200 };
  }
}
