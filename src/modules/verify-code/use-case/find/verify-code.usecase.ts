import type { IUseCase } from "../../../../contracts/use-case.contract.js"
import type { IApiResponse } from "../../../../utils/api-response.js"
import { VerifyCodeService } from "../../../../common/verifyCode/verifyCode.service.js"

interface IVerifyCodeUseCaseResponse {
	userId: string
}

type VerifyCodeDto = {
	verifyCodeId?: string
	code?: string
}

export class VerifyCodeUseCase implements IUseCase<
	VerifyCodeDto,
	IVerifyCodeUseCaseResponse
> {
	async handle(
		dto: VerifyCodeDto,
	): Promise<IApiResponse<IVerifyCodeUseCaseResponse>> {
		await VerifyCodeService.verifyCode(dto.code, dto.verifyCodeId)
		return {
			data: [],
			message: "Usuário verificado com sucesso.",
			statusCode: 200,
			errors: [],
		}
	}
}
