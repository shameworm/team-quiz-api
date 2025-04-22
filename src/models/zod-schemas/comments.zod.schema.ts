import { z } from 'zod';

const commentZodVideoSchema = z.object({
  video: z.string().min(3, 'Comment video must be at least 3 characters long'),
  isCorrect: z.boolean(),
});

export const commentZodSchema = z.object({
  text: z.string().min(1, 'Comment text cannot be empty'),
  videos: z
    .array(commentZodVideoSchema)
    .length(4, 'Videos array must contain exactly 4 items')
    .refine(
      (videos) => videos.filter((v) => v.isCorrect).length === 1,
      'Please select exactly one correct video'
    ),
});

export type Comments = z.infer<typeof commentZodSchema>;
