import { z } from 'zod';

export const createBlogSchema = z
  .object({
    title: z.string().min(2).max(50),
    description: z.string().min(2).max(50),
    image: z.string().optional(),
  })
  .required();

export type CreateBlogDto = z.infer<typeof createBlogSchema>;
