import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string(),
    tag: z.string(),
    description: z.string(),
    price: z.coerce.number(),
    stock: z.coerce.number().int(),
    categoryId: z.uuid(),
    photo: z.custom<Express.Multer.File>().optional(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
