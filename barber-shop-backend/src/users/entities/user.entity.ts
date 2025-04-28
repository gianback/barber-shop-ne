import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
    type: 'varchar',
  })
  email: string;

  @Column()
  password: string;

  @Column()
  avatar: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.user,
  })
  role: UserRole;
}
