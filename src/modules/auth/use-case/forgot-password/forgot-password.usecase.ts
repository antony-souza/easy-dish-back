import type { IForgotPasswordSchema } from "./schemas/forgot-password.schema.js";
import jwt from "jsonwebtoken";
import { getEnvField } from "../../../../config/env.config.js";
import { prisma } from "../../../../config/prisma.connect.js";
import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import { SmtpService } from "../../../../common/smtp/smtp.service.js";

export class ForgotPasswordServiceUseCase implements IUseCase<IForgotPasswordSchema, null> {

  async handle(data: IForgotPasswordSchema) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true, email: true },
    });

    if (!user) {
      return {
        data: null,
        message: "Usuário não encontrado",
        statusCode: 404,
        errors: ["Usuário não encontrado"],
      };
    }

    const resetToken = await jwt.sign(
      { userId: user.id },
      getEnvField.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `${getEnvField.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const smtpService = new SmtpService();

    await smtpService.sendMail({
      to: user.email,
      subject: "Recuperação de senha",
      text: `Clique no link para recuperar sua senha: ${resetLink}`,
    });

    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15m
      },
    });

    return {
      data: null,
      message: "Se o e-mail existir, um link de recuperação foi enviado.",
      statusCode: 200,
      errors: [],
    };
  }
}
