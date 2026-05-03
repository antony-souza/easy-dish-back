import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { IApiResponse } from "../../../../utils/api-response.js";
import { prisma } from "../../../../config/prisma.connect.js";

interface IVerifyCodeUseCaseResponse {
  userId: string
}

type VerifyCode = {
  verifyCodeId: string
  code?: string
}

export class VerifyCodeUseCase implements IUseCase<VerifyCode, IVerifyCodeUseCaseResponse> {
  async handle(dto: VerifyCode): Promise<IApiResponse<IVerifyCodeUseCaseResponse>> {
    if(dto.code) {
      const verifyCode = await prisma.verifyCode.findMany({
        where: {
          code: dto.code,
          deletedAt: null
        },

      })

      if(verifyCode.length > 0 && verifyCode[0]?.id) {
        await prisma.verifyCode.update({
          where: {
            id: verifyCode[0]?.id
          },
          data: {
            code: "verified",
            deletedAt: new Date()
          }
        })

        await prisma.user.update({
          where: {
            id: verifyCode[0].userId
          },
          data: {
            isVerified: true
          }
        })
      }
      
    }
    return {
        data: [],
        message: "Usuário verificado com sucesso.",
        statusCode: 200,
        errors: [],
    }
  }
}