import { prisma } from "../../../../config/prisma.connect.js";
import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { IApiResponse } from "../../../../utils/api-response.js";
import { CacheService } from "../../../../common/cache/cache.service.js";
import { cacheKeysUtils } from "../../../../common/cache/utils/cache-keys.utils.js";

export class DeleteCategoryUseCase implements IUseCase<string, null> {
    private cacheKey = cacheKeysUtils.categoriesAll;

    async handleWithId(id: string): Promise<IApiResponse<null>> {
        const cache = new CacheService();

        const existsCategory = await prisma.category.findFirst({
            where: {
                id: id,
                deletedAt: null,
            },
            select: {
                id: true,
                companyId: true,
            },
        });

        if (!existsCategory) {
            return {
                data: null,
                message: "Categoria não encontrada",
                statusCode: 404,
                errors: ["Categoria não encontrada"],
            }
        }

        await prisma.category.update({
            where: {
                id: id,
            },
            data: {
                deletedAt: new Date(),
            },
        });

        await cache.del(`${this.cacheKey}:${existsCategory.companyId}`);

        return {
            data: null,
            message: "Categoria excluída com sucesso",
            statusCode: 200,
            errors: [],
        };

    }
}