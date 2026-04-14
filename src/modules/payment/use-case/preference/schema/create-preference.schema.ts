import z from "zod";

export const createPreferenceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive().optional(),
});