import { z } from 'zod';

export const addToWishlistSchema = z.object({
  dealId: z.string().uuid('Invalid deal ID'),
  alertEnabled: z.boolean().optional().default(false),
});

export const updateWishlistSchema = z.object({
  alertEnabled: z.boolean(),
});

export const wishlistQuerySchema = z.object({
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).optional(),
  offset: z.string().transform(Number).pipe(z.number().int().nonnegative()).optional(),
});

export type AddToWishlistInput = z.infer<typeof addToWishlistSchema>;
export type UpdateWishlistInput = z.infer<typeof updateWishlistSchema>;
export type WishlistQueryInput = z.infer<typeof wishlistQuerySchema>;
