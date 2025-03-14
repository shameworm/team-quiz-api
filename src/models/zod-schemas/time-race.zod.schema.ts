import { z } from 'zod';

const timeRaceCategorySchema = z.object({
  name: z.string().min(1, 'Category name cannot be empty'),
  examples: z
    .array(z.string().min(1, 'Example cannot be empty'))
    .min(1, 'At least one example is required'),
});

export const timeRaceSchema = z.object({
  timeLimit: z.number().min(1, 'Time limit must be greater than 0'),
  numberOfitems: z.number().min(1, 'Number of items must be greater than 0'),
  categories: z
    .array(timeRaceCategorySchema)
    .min(1, 'At least one category is required'),
});

export type TimeRace = z.infer<typeof timeRaceSchema>;
