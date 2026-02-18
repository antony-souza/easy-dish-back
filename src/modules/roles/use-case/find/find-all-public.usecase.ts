import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import { CacheService } from "../../../../common/cache/cache.service.js";
import type { IApiResponse } from "../../../../utils/api-response.js";
import { prisma } from "../../../../config/prisma.connect.js";
import type { IRoles } from "./find-all.interface.js";
import { cacheKeysUtils } from "../../../../common/cache/utils/cache-keys.utils.js";

export class FindAllPublicRolesUseCase implements IUseCase<void, IRoles[]> {
    private cacheKey = cacheKeysUtils.rolesPublic;

    async handle(): Promise<IApiResponse<IRoles[]>> {

        const redis = new CacheService();

        const cachedData = await redis.get<IRoles[]>(this.cacheKey);

        if (cachedData) {
            return {
                data: cachedData,
                message: "Public roles fetched successfully (cached)",
                statusCode: 200,
                errors: [],
            };
        }

        const result = await prisma.role.findMany({
            where: {
                deletedAt: null,
                isPublic: true,
            },
            select: {
                id: true,
                name: true,
            },
        });

        await redis.set(this.cacheKey, result);

        return {
            data: result,
            message: "Public roles fetched successfully",
            statusCode: 200,
            errors: [],
        };
    }
}
