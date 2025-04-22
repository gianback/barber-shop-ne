import { Injectable } from '@nestjs/common';

enum RolUser {
  admin,
  client,
}

interface User {
  name: string;
  last_name: string;
  email: string;
  password: string;
  avatar: string;
}

type UserPatch = Partial<User>;

@Injectable()
export class UsersService {
  async create({ user }: { user: User }): Promise<string> {
    return await new Promise((resolve) =>
      resolve(`User ${user.name} has been created`),
    );
  }

  async findOne({ id }: { id: number }): Promise<string> {
    return await new Promise((resolve) => resolve(`Found User ${id}`));
  }

  async editUser({
    id,
    payload: _payload,
  }: {
    id: number;
    payload: UserPatch;
  }): Promise<string> {
    return await new Promise((resolve) =>
      resolve(`User ${id} has been updated`),
    );
  }

  async delete({ id }: { id: number }): Promise<string> {
    return await new Promise((resolve) =>
      resolve(`User ${id} has been deleted`),
    );
  }

  async findAll(): Promise<string> {
    return await new Promise((resolve) => resolve('All Users'));
  }
}
