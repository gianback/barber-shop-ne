import slugify from 'slugify';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class BlogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;

  @Column({
    unique: true,
  })
  slug: string;

  @BeforeInsert()
  @BeforeUpdate()
  setSlug() {
    if (!this.title) return;

    const baseSlug = slugify(this.title, { lower: true, strict: true });
    this.slug = baseSlug;
  }
}
