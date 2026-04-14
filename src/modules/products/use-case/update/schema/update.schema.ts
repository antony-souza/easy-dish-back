import { z } from "zod";

export const updateProductSchema = z.object({
    name: z.string(),
    description: z.string(),
    tag: z.string(),
    price: z.coerce.number(),
    stock: z.coerce.number().int(),
    categoryId: z.uuid(),
    photo: z.custom<Express.Multer.File>().optional(),
});

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
