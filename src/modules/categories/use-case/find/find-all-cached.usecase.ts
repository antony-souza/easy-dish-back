import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import { CacheService } from "../../../../common/cache/cache.service.js";
import type { IApiResponse } from "../../../../utils/api-response.js";
import { prisma } from "../../../../config/prisma.connect.js";
import type { IFindAllCategoriesUseCaseResponse } from "./find-all.interface.js";
import { cacheKeysUtils } from "../../../../common/cache/utils/cache-keys.utils.js";

export class FindAllCategoriesCachedUseCase implements IUseCase<void, IFindAllCategoriesUseCaseResponse[]> {
    private cacheKey = cacheKeysUtils.categoriesAll;

    async handleWithId(companyId: string): Promise<IApiResponse<IFindAllCategoriesUseCaseResponse[]>> {

        const redis = new CacheService();
        const companyCacheKey = `${this.cacheKey}:${companyId}`;

        const cachedData = await redis.get<IFindAllCategoriesUseCaseResponse[]>(companyCacheKey);

        if (cachedData) {
            return {
                data: cachedData,
                message: "Categorias listadas com sucesso (cache)",
                statusCode: 200,
                errors: [],
            };
        }

        const result = await prisma.category.findMany({
            where: {
                deletedAt: null,
                companyId,
            },
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        await redis.set(companyCacheKey, result);

        return {
            data: result,
            message: "Categorias listadas com sucesso",
            statusCode: 200,
            errors: [],
        };
    }
}
