import { z } from "zod";

export const updateUserSchema = z.object({
    userId: z.uuid(),
    fullName: z.string(),
    email: z.email(),
    phone: z.string().optional(),
    cpf: z.string().optional(),
    cnpj:z.string().optional(),
    companyId: z.uuid().optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
