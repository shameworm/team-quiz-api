import { z } from 'zod';

const timeRaceCategorySchema = z.object({
  name: z.string(),
  examples: z.array(z.string()),
});

export const timeRaceSchema = z.object({
  timeLimit: z.number(),
  numberOfitems: z.number(),
  categories: z.array(timeRaceCategorySchema),
});

export type TimeRace = z.infer<typeof timeRaceSchema>;
