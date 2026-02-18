import { z } from "zod";

export const createUserSchema = z.object({
    fullName: z.string(),
    email: z.email(),
    phone: z.string().optional(),
    cpf: z.string().optional(),
    cnpj:z.string().optional(),
    password: z.string(),
    roleId: z.uuid(),
    companyId: z.uuid().optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
