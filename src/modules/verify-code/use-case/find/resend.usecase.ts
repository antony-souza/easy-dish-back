import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { IApiResponse } from "../../../../utils/api-response.js";
import { QueueService } from "../../../../common/queue/queue.service.js";
import { QueueNamesUtils } from "../../../../common/queue/queues-names.utils.js";
import { VerifyCodeService } from "../../../../common/verifyCode/verifyCode.service.js";

interface IResendCodeUseCaseResponse {
	userId?: string;
}

type ResendCodeDto = {
	userId: string;
	email: string;
};

export class ResendCodeUseCase implements IUseCase<
	ResendCodeDto,
	IResendCodeUseCaseResponse
> {
	async handle(
		dto: ResendCodeDto,
	): Promise<IApiResponse<IResendCodeUseCaseResponse>> {
		const userEmail = dto.email;
		const newCode = await VerifyCodeService.regenerateUserVerifyCode(
			dto.userId,
		);

		await QueueService.addToQueue(QueueNamesUtils.SEND_EMAIL, {
			emailToSend: userEmail,
			code: newCode,
		});

		return {
			data: [],
			message: "Código de verificação re-enviado com sucesso.",
			statusCode: 200,
			errors: [],
		};
	}
}
