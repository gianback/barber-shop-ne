import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('services')
export class ServiceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'float',
  })
  price: number;

  @Column()
  image: string;

  @Column({
    unique: true,
  })
  slug: string;
}
