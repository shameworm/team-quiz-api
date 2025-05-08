import { z } from 'zod';

export const timeRaceCategorySchema = z.object({
  name: z.string().min(1, 'Category name cannot be empty'),
  examples: z
    .array(z.string().min(1, 'Example cannot be empty'))
    .min(1, 'At least one example is required'),
});

export const timeRaceZodSchema = z.object({
  categories: z
    .array(timeRaceCategorySchema)
    .min(1, 'At least one category is required'),
});

export type TimeRace = z.infer<typeof timeRaceZodSchema>;
