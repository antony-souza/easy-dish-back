import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import { CacheService } from "../../../../common/cache/cache.service.js";
import type { IApiResponse } from "../../../../utils/api-response.js";
import { prisma } from "../../../../config/prisma.connect.js";
import type { IRoles } from "./index.interface.js";
import { cacheKeysUtils } from "../../../../common/cache/utils/cache-keys.utils.js";

export class FindAllRolesUseCase implements IUseCase<void, IRoles[]> {
    private cacheKey = cacheKeysUtils.roles;

    async handle(): Promise<IApiResponse<IRoles[]>> {

        const redis = new CacheService();

        const cachedData = await redis.get<IRoles[]>(this.cacheKey);

        if (cachedData) {
            return {
                data: cachedData,
                message: "Roles fetched successfully (cached)",
                statusCode: 200,
                errors: [],
            };
        }

        const result = await prisma.role.findMany({
            where: {
                deletedAt: null,
            },
            select: {
                name: true,
            },
        });

        await redis.set(this.cacheKey, result, 60);

        return {
            data: result,
            message: "Roles fetched successfully",
            statusCode: 200,
            errors: [],
        };
    }
}
