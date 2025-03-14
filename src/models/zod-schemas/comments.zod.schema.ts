import { z } from 'zod';

const commentVideoSchema = z.object({
  video: z.string(),
  isCorrect: z.boolean(),
});

const commentSchema = z.object({
  text: z.string().min(1, 'Comment text cannot be empty'),
  videos: z
    .array(commentVideoSchema)
    .length(4, 'Videos array must contain exactly 4 items'),
});

export const commentsSchema = z.object({
  comments: z.array(commentSchema).min(1, 'At least one comment is required'),
});

export type Comments = z.infer<typeof commentsSchema>;
