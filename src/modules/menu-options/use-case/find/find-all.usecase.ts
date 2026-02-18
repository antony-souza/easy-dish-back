import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import { CacheService } from "../../../../common/cache/cache.service.js";
import type { IApiResponse } from "../../../../utils/api-response.js";
import { prisma } from "../../../../config/prisma.connect.js";
import type { IMenuOption } from "./find-all.interface.js";
import { cacheKeysUtils } from "../../../../common/cache/utils/cache-keys.utils.js";

export class FindAllMenuOptionsUseCase implements IUseCase<string, IMenuOption[]> {
    private cacheKey = cacheKeysUtils.menuOptions;

    async handle(roleId: string): Promise<IApiResponse<IMenuOption[]>> {

        const redis = new CacheService();

        const cacheKey = this.cacheKey + `:${roleId}`;

        const cachedData = await redis.get<IMenuOption[]>(cacheKey);

        if (cachedData) {
            return {
                data: cachedData,
                message: "Menu options fetched successfully (cached)",
                statusCode: 200,
                errors: [],
            };
        }

        const items = await prisma.menuOption.findMany({
            where: {
                deletedAt: null,
                roleId: roleId,
            },
            select: {
                id: true,
                title: true,
                path: true,
                icon: true,
                subMenuOptions: {
                    where: {
                        deletedAt: null,
                    },
                    select: {
                        id: true,
                        title: true,
                        path: true,
                        icon: true,
                    },
                    orderBy: {
                        order: "asc",
                    },
                }
            },
            orderBy: {
                order: "asc",
            }
        });

        await redis.set(cacheKey, items);

        return {
            data: items,
            message: "Menu options fetched successfully",
            statusCode: 200,
            errors: [],
        };
    }
}
