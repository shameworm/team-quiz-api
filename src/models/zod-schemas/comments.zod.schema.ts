import { z } from 'zod';

const commentVideoSchema = z.object({
  video: z.string(),
  isCorrect: z.boolean(),
});

const commentSchema = z.object({
  text: z.string(),
  videos: commentVideoSchema,
});

export const commentsSchema = z.object({
  comments: z.array(commentSchema),
});

export type Comments = z.infer<typeof commentsSchema>;
