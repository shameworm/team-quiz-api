import { z } from 'zod';

export const gameZodSchema = z.object({
  name: z
    .string()
    .min(3, 'Name should be at least 3 characters long')
    .max(255, 'Name should not exceed 255 characters'),
  description: z
    .string()
    .min(3, 'Description should be at least 3 characters long')
    .max(255, 'Description should not exceed 255 characters'),
  image: z.string().nullable().optional(),
});

export type Game = z.infer<typeof gameZodSchema>;
