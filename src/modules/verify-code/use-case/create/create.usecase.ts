import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { IApiResponse } from "../../../../utils/api-response.js";
import { prisma } from "../../../../config/prisma.connect.js";
import { generateAlphanumeric } from "../../../../utils/generateAlphanumericString.js";

interface ICreateVerifyCodeUseCaseResponse {
  userId: string
}

type CreateVerifyCode = {
  userId: string
}

export class CreateVerifyCodeUseCase implements IUseCase<CreateVerifyCode, ICreateVerifyCodeUseCaseResponse> {
  async handle(dto: CreateVerifyCode): Promise<IApiResponse<ICreateVerifyCodeUseCaseResponse>> {
    const generatedVerifyCode = generateAlphanumeric()

    await prisma.verifyCode.create({
      data: {
        code: generatedVerifyCode,
        userId: dto.userId
      }
    })
    return {
        data: [],
        message: "Código de verificação criado com sucesso.",
        statusCode: 201,
        errors: [],
    }
  }
}