import { z } from "zod";

export const updateCategorySchema = z.object({
    name: z.string(),
    tag: z.string(),
    companyId: z.uuid(),
    photo: z.custom<Express.Multer.File>().optional(),
});

export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
