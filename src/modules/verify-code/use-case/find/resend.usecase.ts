import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { IApiResponse } from "../../../../utils/api-response.js";
import { prisma } from "../../../../config/prisma.connect.js";
import { generateAlphanumeric } from "../../../../utils/generateAlphanumericString.js";
import { QueueService } from "../../../../common/queue/queue.service.js";
import { QueueNamesUtils } from "../../../../common/queue/queues-names.utils.js";

interface IResendCodeUseCaseResponse {
  userId?: string
}

type ResendCodeDto = {
  userId: string,
  email?: string
}

export class ResendCodeUseCase implements IUseCase<ResendCodeDto, IResendCodeUseCaseResponse> {
  async handle(dto: ResendCodeDto): Promise<IApiResponse<IResendCodeUseCaseResponse>> {
    const generatedCode = generateAlphanumeric()
    let userEmail = dto.email
    const verifyCode = await prisma.verifyCode.update({
      where: {
        userId: dto.userId,
      },
      data: {
        code: generatedCode
      }
    
  })
    if(!userEmail) {
      const user = await prisma.user.findUnique({
        where: {
          id: verifyCode.userId
        }
      })
      userEmail = user?.email
    }
    await QueueService.addToQueue(QueueNamesUtils.SEND_EMAIL, {emailToSend: userEmail, code: verifyCode.code})
    return {
        data: [],
        message: "Código de verificação re-enviado com sucesso.",
        statusCode: 200,
        errors: [],
    }
  }
}