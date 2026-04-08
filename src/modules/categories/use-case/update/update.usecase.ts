import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { IApiResponse } from "../../../../utils/api-response.js";
import { prisma } from "../../../../config/prisma.connect.js";
import type { UpdateCategoryDto } from "./schema/update.schema.js";
import { uploadService } from "../../../../common/upload/upload.service.js";

interface IUpdateCategoryUseCaseResponse {
    id: string;
}

export class UpdateCategoryUseCase implements IUseCase<UpdateCategoryDto, IUpdateCategoryUseCaseResponse> {
    async handleWithId(categoryId: string, dto: UpdateCategoryDto): Promise<IApiResponse<IUpdateCategoryUseCaseResponse>> {

        const existsCategory = await prisma.category.findUnique({
            where: {
                id: categoryId,
                tag: dto.tag,
                companyId: dto.companyId,
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
                id: categoryId,
            },
            data: {
                name: dto.name,
                tag: dto.tag,
                imageUrl: imageUrl,
                companyId: dto.companyId,
            },
            select: {
                id: true,
            },
        });

        return {
            data: category,
            message: "Categoria atualizada com sucesso",
            statusCode: 200,
            errors: [],
        }
    }
}
