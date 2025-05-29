import { AppointmentEntity } from 'src/appointments/entities/appointment.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.service)
  appointment: AppointmentEntity;
}
