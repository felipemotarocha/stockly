import { z } from "zod";

export const createSaleSchema = z.object({
  saleId: z.string().uuid().optional(),
  products: z.array(
    z.object({
      id: z.string().uuid(),
      quantity: z.number().int().positive(),
    }),
  ),
});

export type CreateSaleSchema = z.infer<typeof createSaleSchema>;
