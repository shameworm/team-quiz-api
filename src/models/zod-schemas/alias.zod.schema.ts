import { z } from 'zod';

export const aliasZodSchema = z.object({
  words: z
    .array(z.string().min(1, 'Word cannot be empty'))
    .min(1, 'At least one word is required')
    .max(255, 'Too many words, maximum is 255'),
});

export type Alias = z.infer<typeof aliasZodSchema>;
