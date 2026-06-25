import { z } from 'zod';

export const contactSchema = z.object({
  fullName: z.string().min(2, 'fullName must have at least 2 characters'),
  relation: z.enum(['familia', 'amigo', 'parceiro', 'colega', 'outro']),
  birthDate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: 'birthDate must be a valid ISO date string' },
  ),
  photoUrl: z.string().url().optional(),
  notes: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
