import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { IApiResponse } from "../../../../utils/api-response.js";
import type { Product } from "../../../../generated/prisma/client.js";
import { prisma } from "../../../../config/prisma.connect.js";
import type { CreateProductDto } from "./schema/create.schema.js";
import { uploadService } from "../../../../common/upload/upload.service.js";

export class CreateProductUseCase implements IUseCase<CreateProductDto, Product> {
    async handleWithId(companyId: string, dto: CreateProductDto): Promise<IApiResponse<Product>> {

        const existsCategory = await prisma.category.count({
            where: {
                id: dto.categoryId,
                companyId: companyId,
                deletedAt: null,
            },
        });

        if (existsCategory === 0) {
            return {
                data: [],
                message: "Categoria não encontrada",
                statusCode: 404,
                errors: ["Categoria não encontrada"],
            }
        }

        const existsProduct = await prisma.product.count({
            where: {
                tag: dto.tag,
                deletedAt: null,
            },
        });

        if (existsProduct > 0) {
            return {
                data: [],
                message: "Produto já cadastrado",
                statusCode: 400,
                errors: ["Produto já cadastrado"],
            }
        }

        let imageUrl: string | null = null;

        if (dto.photo) {
            imageUrl = (await uploadService.uploadFile(dto.photo, "products")).url;
        }

        const product = await prisma.product.create({
            data: {
                name: dto.name,
                description: dto.description,
                tag: dto.tag,
                imageUrl: imageUrl,
                price: dto.price,
                stock: dto.stock,
                categoryId: dto.categoryId,
                companyId: companyId,
            },
        });

        return {
            data: product,
            message: "Produto cadastrado com sucesso",
            statusCode: 201,
            errors: [],
        }
    }
}
