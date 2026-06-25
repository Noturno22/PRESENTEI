import { z } from 'zod';

export const createOrderSchema = z.object({
  contactId: z.string().uuid(),
  digitalCardId: z.string().uuid().optional(),
  scheduledDeliveryDate: z.string().optional(),
  deliveryAddress: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1, 'quantity must be at least 1'),
      }),
    )
    .min(1, 'At least one item is required'),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
