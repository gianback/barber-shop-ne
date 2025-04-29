import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dtos/createBlog.dto';
import { GeneralResponse } from 'src/users/users.service';
import slugify from 'slugify';
import { BadRequestException, Injectable } from '@nestjs/common';

export type PatchBlog = Partial<BlogEntity>;

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
  ) {}

  async createPost({
    blog,
  }: {
    blog: CreateBlogDto;
  }): Promise<GeneralResponse> {
    const { description, image, title } = blog;
    const baseSlug = slugify(title, { lower: true, strict: true });
    let newSlug = baseSlug;
    let counter = 1;

    const existsSlug = await this.blogRepository.findOne({
      where: { slug: baseSlug },
    });

    while (existsSlug) {
      newSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newBlog = this.blogRepository.create({
      description,
      image,
      title,
      slug: newSlug,
    });

    await this.blogRepository.save(newBlog);

    return {
      message: 'Blog created successfully',
      status: 200,
    };
  }

  async deletePost({ id }: { id: number }): Promise<GeneralResponse> {
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
    payload,
  }: {
    id: number;
    payload: PatchBlog;
  }): Promise<GeneralResponse> {
    const post = await this.blogRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    Object.assign(post, payload);

    await this.blogRepository.save(post);

    return { message: 'Post updated', status: 200 };
  }
}
