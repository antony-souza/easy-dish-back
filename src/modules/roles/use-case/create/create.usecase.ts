import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { Role } from "../../../../generated/prisma/client.js";
import type { CreateRoleDto } from "./schema/create-role.schema.js";
import type { IApiResponse } from "../../../../utils/api-response.js";
import { prisma } from "../../../../config/prisma.connect.js";
import { CacheService } from "../../../../common/cache/cache.service.js";
import { cacheKeysUtils } from "../../../../common/cache/utils/cache-keys.utils.js";

export class CreateRoleUseCase implements IUseCase<CreateRoleDto, Role> {
    private cacheKey = cacheKeysUtils.roles;

    async handle(dto: CreateRoleDto): Promise<IApiResponse<Role>> {
        const redis = new CacheService();

        const existsRole = await prisma.role.count({
            where: {
                name: dto.name,
                tag: dto.tag,
            },
        });

        if (existsRole > 0) {
            return {
                data: [],
                message: "Cargo já cadastrado",
                statusCode: 400,
                errors: ["Cargo já cadastrado"],
            }
        }

        const role = await prisma.role.create({
            data: {
                name: dto.name,
                tag: dto.tag,
            },
        });

        await redis.del(this.cacheKey);

        return {
            data: role,
            message: "Cargo cadastrado com sucesso",
            statusCode: 201,
            errors: [],
        }
    }
}