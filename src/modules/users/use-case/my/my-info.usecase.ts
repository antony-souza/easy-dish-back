import { CacheService } from "../../../../common/cache/cache.service.js";
import { cacheKeysUtils } from "../../../../common/cache/utils/cache-keys.utils.js";
import { prisma } from "../../../../config/prisma.connect.js";
import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { IApiResponse } from "../../../../utils/api-response.js";
import type { IMyInfoUseCaseResponse } from "./my-info.interface.js";

export class MyInfoUseCase implements IUseCase<string, IMyInfoUseCaseResponse> {
    private cacheKey = cacheKeysUtils.myInfo;

    async handle(userId: string): Promise<IApiResponse<IMyInfoUseCaseResponse>> {
        const cache = new CacheService();

        const cachedData = await cache.get<IMyInfoUseCaseResponse>(`${this.cacheKey}-${userId}`);

        if (cachedData) {
            return {
                data: cachedData,
                message: "Informações do usuário obtidas com sucesso (cache)",
                statusCode: 200,
                errors: [],
            };
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                cpf: true,
                company: {
                    select: {
                        id: true,
                        tradeName: true,
                        cnpj: true
                    }
                }
            }
        });

        if (!user) {
            return {
                data: [],
                message: "Usuário não encontrado",
                statusCode: 404,
                errors: ["Usuário com o ID fornecido não existe"]
            }
        }

        return {
            data: user,
            message: "Informações do usuário obtidas com sucesso",
            statusCode: 200,
            errors: [],
        }
    }
}