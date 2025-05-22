import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class ServiceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column({
    type: 'float',
  })
  price: number;
}
