import { z } from 'zod';

export const gameSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(3).max(255),
  image: z.string().nullable(),
});

export type Game = z.infer<typeof gameSchema>;
