import z from "zod";

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type IResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
