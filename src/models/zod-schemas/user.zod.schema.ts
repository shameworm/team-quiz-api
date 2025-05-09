import { z } from 'zod';

export const userSingupZodSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, "Username can't be longer than 30 characters"),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Password confirmation must be at least 6 characters'),
    image: z.string().nullable().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const userLoginZodSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type UserLoginInput = z.infer<typeof userLoginZodSchema>;
export type UserSingupInput = z.infer<typeof userSingupZodSchema>;
