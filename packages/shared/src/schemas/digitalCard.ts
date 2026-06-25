import { z } from 'zod';

export const digitalCardSchema = z.object({
  templateKey: z.string(),
  message: z.string().min(1, 'Message is required'),
  recipientName: z.string().optional(),
});

export type DigitalCardInput = z.infer<typeof digitalCardSchema>;
