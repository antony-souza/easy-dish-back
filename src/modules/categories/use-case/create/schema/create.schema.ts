import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string(),
    tag: z.string(),
    companyId: z.uuid(),
    photo: z.custom<Express.Multer.File>().optional(),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
