import type { IForgotPasswordSchema } from "./schemas/forgot-password.schema.js";
import jwt from "jsonwebtoken";
import { getEnvField } from "../../../../config/env.config.js";
import { prisma } from "../../../../config/prisma.connect.js";
import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import { SmtpService } from "../../../../common/smtp/smtp.service.js";

export class ForgotPasswordServiceUseCase implements IUseCase<IForgotPasswordSchema, null> {
  constructor(
    private readonly smtpService: SmtpService,
  ) { }

  async handle(data: IForgotPasswordSchema) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true, email: true },
    });

    if (!user) {
      return {
        data: null,
        message: "Se o e-mail existir, um link de recuperação foi enviado.",
        statusCode: 200,
        errors: [],
      };
    }

    const resetToken = jwt.sign(
      { userId: user.id },
      getEnvField.JWT_SECRET,
      { expiresIn: "15m" }
    );

    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15m
      },
    });

    const resetLink = `${getEnvField.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await this.smtpService.sendMail({
      to: user.email,
      subject: "Recuperação de senha",
      text: `Clique no link para recuperar sua senha: ${resetLink}`,
    });

    return {
      data: null,
      message: "Se o e-mail existir, um link de recuperação foi enviado.",
      statusCode: 200,
      errors: [],
    };
  }
}
