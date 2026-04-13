import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string(),
    tag: z.string(),
    photo: z.custom<Express.Multer.File>().optional(),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
