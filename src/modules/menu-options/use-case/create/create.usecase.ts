import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { MenuOption } from "../../../../generated/prisma/client.js";
import type { CreateMenuOptionDto } from "./schema/create-menu-option.schema.js";
import type { IApiResponse } from "../../../../utils/api-response.js";
import { prisma } from "../../../../config/prisma.connect.js";
import { CacheService } from "../../../../common/cache/cache.service.js";
import { cacheKeysUtils } from "../../../../common/cache/utils/cache-keys.utils.js";

export class CreateMenuOptionUseCase implements IUseCase<CreateMenuOptionDto, MenuOption[]> {
    private cacheKey = cacheKeysUtils.menuOptions;

    async handle(dto: CreateMenuOptionDto): Promise<IApiResponse<MenuOption[]>> {
        const redis = new CacheService();

        const slugs = dto.map(d => d.slug);
        const paths = dto.map(d => d.path);

        const uniqueSlugs = new Set(slugs);
        const uniquePaths = new Set(paths);

        if (uniqueSlugs.size !== slugs.length || uniquePaths.size !== paths.length) {
             return {
                data: [],
                message: "Não pode haver slugs ou paths duplicados no mesmo payload",
                statusCode: 400,
                errors: ["Duplicate slugs or paths in payload"],
            }
        }
        
        const existsMenuOption = await prisma.menuOption.count({
            where: {
                OR: [
                    {
                        slug: {
                            in: slugs
                        }
                    },
                    {
                        path: {
                            in: paths
                        }
                    }
                ]
            },
        });

        if (existsMenuOption > 0) {
            return {
                data: [],
                message: "Um ou mais slugs já estão cadastrados",
                statusCode: 400,
                errors: ["One or more slugs already in use"],
            }
        }

        const menuOptions = await prisma.$transaction(async (tx) => {
            const createdOptions = [];
            for (const item of dto) {
                const menuOption = await tx.menuOption.create({
                    data: {
                        title: item.title,
                        slug: item.slug,
                        path: item.path,
                        icon: item.icon,
                        roleId: item.roleId,
                        order: item.order || 0,
                        deviceType: item.deviceType,
                        subMenuOptions: {
                            create: item.subMenuOptions?.map(sub => ({
                                title: sub.title,
                                slug: sub.slug,
                                path: sub.path,
                                icon: sub.icon,
                                order: sub.order || 0,
                            })) || [],
                        }
                    },
                });
                createdOptions.push(menuOption);
            }
            return createdOptions;
        });

        await redis.del(this.cacheKey);

        return {
            data: menuOptions,
            message: "Menu options created successfully",
            statusCode: 201,
            errors: [],
        }
    }
}
