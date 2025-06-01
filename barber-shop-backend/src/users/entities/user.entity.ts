import { MaxLength } from 'class-validator';
import { AppointmentEntity } from 'src/appointments/entities/appointment.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum UserRole {
  admin = 'admin',
  user = 'user',
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  last_name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    default: null,
  })
  avatar: string;

  @Column()
  @MaxLength(9)
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.user,
  })
  role: UserRole;

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.user)
  appointments: AppointmentEntity[];

  @BeforeInsert()
  checkEmailBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkEmailBeforeUpdate() {
    this.checkEmailBeforeInsert();
  }
}
