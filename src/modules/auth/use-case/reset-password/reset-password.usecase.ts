import type { IResetPasswordSchema } from "./schemas/reset-password.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getEnvField } from "../../../../config/env.config.js";
import { prisma } from "../../../../config/prisma.connect.js";
import type { IUseCase } from "../../../../contracts/use-case.contract.js";

export class ResetPasswordServiceUseCase implements IUseCase<IResetPasswordSchema, null> {
  async handle(data: IResetPasswordSchema) {
    try {
      const decoded = jwt.verify(data.token, getEnvField.JWT_SECRET) as { userId: string };

      if (!decoded || !decoded.userId) {
        return {
          data: null,
          message: "Link inválido ou expirado",
          statusCode: 400,
          errors: ["Link inválido ou expirado"],
        };
      }

      const resetTokenRecord = await prisma.passwordResetToken.findUnique({
        where: { token: data.token }
      });

      if (!resetTokenRecord || resetTokenRecord.used || resetTokenRecord.expiresAt < new Date()) {
        return {
          data: null,
          message: "Link inválido ou já utilizado",
          statusCode: 400,
          errors: ["Link inválido ou já utilizado"],
        };
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        return {
          data: null,
          message: "Usuário não encontrado",
          statusCode: 404,
          errors: ["Usuário não encontrado"],
        };
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: user.id },
          data: { password: hashedPassword },
        });

        await tx.passwordResetToken.update({
          where: {
            id: resetTokenRecord.id,
            deletedAt: null
          },
          data: {
            deletedAt: new Date()
          },
        })
      });

      return {
        data: null,
        message: "Senha atualizada com sucesso",
        statusCode: 200,
        errors: [],
      };
    } catch {
      return {
        data: null,
        message: "Link inválido ou expirado",
        statusCode: 400,
        errors: ["Link inválido ou expirado"],
      };
    }
  }
}
