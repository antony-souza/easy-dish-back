import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { IApiResponse } from "../../../../utils/api-response.js";
import { prisma } from "../../../../config/prisma.connect.js";
import type { UpdateCategoryDto } from "./schema/update.schema.js";
import { uploadService } from "../../../../common/upload/upload.service.js";
import { CacheService } from "../../../../common/cache/cache.service.js";
import { cacheKeysUtils } from "../../../../common/cache/utils/cache-keys.utils.js";

interface IUpdateCategoryUseCaseResponse {
    id: string;
}

export interface IUpdateCategoryIdsParamsUseCase {
    categoryId: string;
    companyId: string;
}
export class UpdateCategoryUseCase implements IUseCase<UpdateCategoryDto, IUpdateCategoryUseCaseResponse> {
    private cacheKey = cacheKeysUtils.categoriesAll;

    async handleWithIds(paramsIds: IUpdateCategoryIdsParamsUseCase, dto: UpdateCategoryDto): Promise<IApiResponse<IUpdateCategoryUseCaseResponse>> {
        const cache = new CacheService();

        const existsCategory = await prisma.category.findUnique({
            where: {
                id: paramsIds.categoryId,
                tag: dto.tag,
                companyId: paramsIds.companyId,
                deletedAt: null,
            },
            select: {
                id: true,
                imageUrl: true,
            },
        });

        if (!existsCategory) {
            return {
                data: [],
                message: "Categoria não encontrada",
                statusCode: 404,
                errors: ["Categoria não encontrada"],
            }
        }

        let imageUrl: string | null = existsCategory?.imageUrl ?? null;

        if (dto.photo) {
            imageUrl = (await uploadService.uploadFile(dto.photo, "categories")).url;
        }

        const category = await prisma.category.update({
            where: {
                id: paramsIds.categoryId,
            },
            data: {
                name: dto.name,
                tag: dto.tag,
                imageUrl: imageUrl,
                companyId: paramsIds.companyId,
            },
            select: {
                id: true,
            },
        });

        await cache.del(`${this.cacheKey}:${paramsIds.companyId}`);

        return {
            data: category,
            message: "Categoria atualizada com sucesso",
            statusCode: 200,
            errors: [],
        }
    }
}
