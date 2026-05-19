import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { IApiResponse } from "../../../../utils/api-response.js";
import { VerifyCodeService } from "../../../../common/verifyCode/verifyCode.service.js";

interface IVerifyCodeUseCaseResponse {
	userId: string;
}

type VerifyCodeDto = {
	code: string;
	userId: string;
};

export class VerifyCodeUseCase implements IUseCase<
	VerifyCodeDto,
	IVerifyCodeUseCaseResponse
> {
	async handle(
		dto: VerifyCodeDto,
	): Promise<IApiResponse<IVerifyCodeUseCaseResponse>> {
		const responseData: IApiResponse<IVerifyCodeUseCaseResponse> = {
			data: [],
			message: "Código incorreto",
			statusCode: 400,
			errors: [],
		};
		try {
			const verify = await VerifyCodeService.verifyCode(dto.code, dto.userId);
			if (verify?.success) {
				responseData.statusCode = 200;
				responseData.message = "Usuário verificado com sucesso.";
			}
		} catch (error) {
			responseData.statusCode = 500;
			responseData.message = String(error);
			responseData.errors = [String(error)];
		}

		return responseData;
	}
}
