import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dtos/createBlog.dto';
import slugify from 'slugify';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
  }): Promise<{ success: boolean; blog: BlogEntity }> {
    const user = await this.usersService.findById({ id: userId });

    if (user === null) {
      throw new BadRequestException('User not found');
    }

    const isAdmin = user.role === UserRole.admin;

    if (!isAdmin) {
      throw new UnauthorizedException('User not authorized');
    }

    const isMoreThan1MB = image.size > 1048576;

    if (isMoreThan1MB)
      throw new BadRequestException('Image size must be less than 1MB');

    const slug = this.parseNameToSlug(blog.title);
    try {
      const urlImage = await this.uploadFileService.uploadFile(image);

      const newBlog = this.blogRepository.create({
        description: blog.description,
        image: urlImage,
        title: blog.title,
        slug,
        description_small: blog.description_small,
      });

      const blogCreated = await this.blogRepository.save(newBlog);

      return {
        success: true,
        blog: blogCreated,
      };
    } catch (error: any) {
      console.log('error creando el blog en createBlog', error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === '23505') {
        throw new BadRequestException(`El titulo ${blog.title} ya existe`);
      }

      throw new InternalServerErrorException('Error de servidor');
    }
  }

  //TODO: UPDATE IMAGE BLOG
  async updateImageBlog({
    userId,
    id,
    file,
  }: {
    userId: number;
    id: number;
    file: Express.Multer.File;
  }) {
    const user = await this.usersService.findById({ id: userId });

    if (user === null) {
      throw new BadRequestException('User not found');
    }

    const isAdmin = user.role === UserRole.admin;

    if (!isAdmin) {
      throw new UnauthorizedException('User not authorized');
    }

    const blog = await this.blogRepository.findOne({
      where: { id },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const imageUrl = await this.uploadFileService.uploadFile(file);

    blog.image = imageUrl;

    await this.blogRepository.save(blog);

    return {
      success: true,
      message: 'Imagen del servicio actualizada exitosamente',
      blog,
    };
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

  async findOne({ id }: { id: number }): Promise<BlogEntity> {
    const post = await this.blogRepository.findOne({
      where: { id },
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
  }): Promise<{ success: boolean; blog: BlogEntity }> {
    const user = await this.usersService.findById({ id: userId });

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

    return { success: true, blog: post };
  }

  parseNameToSlug(name: string): string {
    const slug = slugify(name, { lower: true, strict: true });

    return slug;
  }
}
