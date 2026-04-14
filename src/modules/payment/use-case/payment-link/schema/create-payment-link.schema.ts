import z from "zod";

export const createPaymentLinkSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive().optional(),
});