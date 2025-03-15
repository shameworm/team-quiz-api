import { z } from 'zod';

const brainstormQuestion = z.object({
  question: z.string().min(1, 'Question cannot be empty'),
  answer: z.string().min(1, 'Answer cannot be empty'),
  points: z.number().default(1),
});

const brainstormCategorySchema = z.object({
  name: z.string().min(1, 'Category name cannot be empty'),
  easy: brainstormQuestion,
  hard: brainstormQuestion,
});

export const brainstormZodSchema = z.object({
  categories: z
    .array(brainstormCategorySchema)
    .min(1, 'At least one category is required'),
});

export type Brainstorm = z.infer<typeof brainstormZodSchema>;
