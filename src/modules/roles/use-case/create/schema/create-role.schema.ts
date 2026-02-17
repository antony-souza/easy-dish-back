import { z } from "zod";

export const createRoleSchema = z.object({
    name: z.string(),
    tag: z.string(),
});

export type CreateRoleDto = z.infer<typeof createRoleSchema>;
