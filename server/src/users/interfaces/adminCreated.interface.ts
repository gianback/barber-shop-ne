import { UserRole } from '../entities/user.entity';

export interface AdminCreated {
  id: number;
  name: string;
  last_name: string;
  email: string;
  avatar: string | null;
  role: UserRole;
}
