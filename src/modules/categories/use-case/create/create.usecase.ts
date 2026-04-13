import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { IApiResponse } from "../../../../utils/api-response.js";
import type { Category } from "../../../../generated/prisma/client.js";
import { prisma } from "../../../../config/prisma.connect.js";
import type { CreateCategoryDto } from "./schema/create.schema.js";
import { uploadService } from "../../../../common/upload/upload.service.js";

export class CreateCategoryUseCase implements IUseCase<CreateCategoryDto, Category> {
    async handleWithId(companyId: string, dto: CreateCategoryDto): Promise<IApiResponse<Category>> {

        const existsCompany = await prisma.company.count({
            where: {
                id: companyId,
                deletedAt: null,
            },
        });

        if (existsCompany === 0) {
            return {
                data: [],
                message: "Empresa não encontrada",
                statusCode: 404,
                errors: ["Empresa não encontrada"],
            }
        }

        const existsCategory = await prisma.category.count({
            where: {
                tag: dto.tag,
                deletedAt: null,
            },
        });

        if (existsCategory > 0) {
            return {
                data: [],
                message: "Categoria já cadastrada",
                statusCode: 400,
                errors: ["Categoria já cadastrada"],
            }
        }

        let imageUrl: string | null = null;

        if (dto.photo) {
            imageUrl = (await uploadService.uploadFile(dto.photo, "categories")).url;
        }

        const category = await prisma.category.create({
            data: {
                name: dto.name,
                tag: dto.tag,
                imageUrl: imageUrl,
                companyId: companyId,
            },
        });

        return {
            data: category,
            message: "Categoria cadastrada com sucesso",
            statusCode: 201,
            errors: [],
        }
    }
}
