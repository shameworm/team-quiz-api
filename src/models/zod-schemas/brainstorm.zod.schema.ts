import { z } from 'zod';

const brainstormQuestion = z.object({
  question: z.string(),
  answer: z.string(),
  points: z.number().default(1),
});

const brainstormCategorySchema = z.object({
  name: z.string(),
  easy: brainstormQuestion,
  hard: brainstormQuestion,
});

export const brainstormSchema = z.object({
  categories: z.array(brainstormCategorySchema),
});

export type Brainstorm = z.infer<typeof brainstormSchema>;
