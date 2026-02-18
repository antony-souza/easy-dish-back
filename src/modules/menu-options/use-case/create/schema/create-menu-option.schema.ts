import { z } from "zod";

const deviceTypeEnum = z.enum(["desktop", "mobile"]);

export const createMenuOptionSchema = z.array(z.object({
    title: z.string(),
    slug: z.string(),
    path: z.string(),
    icon: z.string(),
    roleId: z.string(),
    order: z.number().optional(),
    deviceType: deviceTypeEnum.default("desktop"),
    subMenuOptions: z.array(z.object({
        title: z.string(),
        slug: z.string(),
        path: z.string(),
        icon: z.string(),
        order: z.number().optional(),
    })).optional(),
}));

export type CreateMenuOptionDto = z.infer<typeof createMenuOptionSchema>;
