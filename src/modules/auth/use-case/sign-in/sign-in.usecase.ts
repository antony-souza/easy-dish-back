import type { ISignInSchema } from "./schemas/sign-in.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getEnvField } from "../../../../config/env.config.js";
import { prisma } from "../../../../config/prisma.connect.js";
import { type IApiResponse } from "../../../../utils/api-response.js";
import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { ISignInResponse } from "./interfaces/sign-in.interface.js";

export class SignInServiceUseCase implements IUseCase<ISignInSchema, ISignInResponse> {

  async handle(data: ISignInSchema) {

    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      return {
        data: null,
        message: "Usuário não encontrado",
        statusCode: 404,
        errors: ["Usuário não encontrado"],
      }
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return {
        data: null,
        message: "Credenciais inválidas",
        statusCode: 401,
        errors: ["Credenciais inválidas"],
      }
    }

    const token = jwt.sign({
      user: {
        id: user.id,
      }
    },
      getEnvField.JWT_SECRET,
      {
        expiresIn: "1d",
      });

    return {
      data: { token },
      message: "Login realizado com sucesso",
      statusCode: 200,
      errors: [],
    }
  }
}