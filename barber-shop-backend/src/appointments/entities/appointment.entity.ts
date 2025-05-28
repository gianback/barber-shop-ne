import { ServiceEntity } from 'src/services/entities/services.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('appointments')
export class AppointmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamptz',
  })
  date: Date;

  @OneToMany(() => ServiceEntity, (service) => service.appointment, {
    cascade: true,
  })
  service: ServiceEntity;

  @OneToMany(() => UserEntity, (user) => user.appointments, {
    cascade: true,
  })
  user: UserEntity;

  @Column({
    default: false,
  })
  paid: boolean;
}
