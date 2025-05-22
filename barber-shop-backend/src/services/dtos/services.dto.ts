// import { z } from 'zod';

// export const serviceSchema = z.object({
//   name: z.string().min(2).max(255),
//   description: z.string().min(2).max(255),
//   image: z.string(),
//   price: z.number().min(0).max(1000),
// });

// export type ServicesDto = z.infer<typeof serviceSchema>;

import { IsNotEmpty, IsString, MinLength } from 'class-validator';
export class ServicesDto {
  @IsString()
  @MinLength(2)
  @MinLength(255)
  name: string;

  @IsString()
  @MinLength(2)
  @MinLength(255)
  description: string;

  @IsString()
  image: string;

  @IsNotEmpty()
  price: number;
}
