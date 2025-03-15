import { z } from 'zod';

const brainstormZodQuestion = z.object({
  question: z.string().min(1, 'Question cannot be empty'),
  answer: z.string().min(1, 'Answer cannot be empty'),
  points: z.number().default(1),
});

export const brainstormZodCategorySchema = z.object({
  name: z.string().min(1, 'Category name cannot be empty'),
  easy: brainstormZodQuestion,
  hard: brainstormZodQuestion,
});

export type Brainstorm = z.infer<typeof brainstormZodCategorySchema>;
