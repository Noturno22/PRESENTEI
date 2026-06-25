import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2, 'fullName must have at least 2 characters'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
