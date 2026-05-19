import type { IUseCase } from "../../../../contracts/use-case.contract.js"
import type { IApiResponse } from "../../../../utils/api-response.js"
import { VerifyCodeService } from "../../../../common/verifyCode/verifyCode.service.js"

interface ICreateVerifyCodeUseCaseResponse {
	userId: string
}

type CreateVerifyCode = {
	userId: string
}

export class CreateVerifyCodeUseCase implements IUseCase<
	CreateVerifyCode,
	ICreateVerifyCodeUseCaseResponse
> {
	async handle(
		dto: CreateVerifyCode,
	): Promise<IApiResponse<ICreateVerifyCodeUseCaseResponse>> {
		await VerifyCodeService.createNewVerifyCode(dto.userId)

		return {
			data: [],
			message: "Código de verificação criado com sucesso.",
			statusCode: 201,
			errors: [],
		}
	}
}
