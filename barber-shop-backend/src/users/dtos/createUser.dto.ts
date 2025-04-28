import { z } from 'zod';

export const createUserSchema = z
  .object({
    name: z.string().min(2).max(50),
    last_name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(4).max(50),
    avatar: z.string().optional(),
  })
  .required();

export type CreateCatDto = z.infer<typeof createUserSchema>;
