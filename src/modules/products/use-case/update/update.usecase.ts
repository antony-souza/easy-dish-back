import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { IApiResponse } from "../../../../utils/api-response.js";
import { prisma } from "../../../../config/prisma.connect.js";
import type { UpdateProductDto } from "./schema/update.schema.js";
import { uploadService } from "../../../../common/upload/upload.service.js";

interface IUpdateProductUseCaseResponse {
    id: string;
}

export class UpdateProductUseCase implements IUseCase<UpdateProductDto, IUpdateProductUseCaseResponse> {
    async handleWithId(productId: string, dto: UpdateProductDto): Promise<IApiResponse<IUpdateProductUseCaseResponse>> {

        const existsProduct = await prisma.product.findUnique({
            where: {
                id: productId,
                tag: dto.tag,
                categoryId: dto.categoryId,
                deletedAt: null,
            },
            select: {
                id: true,
                imageUrl: true,
            },
        });

        if (!existsProduct) {
            return {
                data: [],
                message: "Produto não encontrado",
                statusCode: 404,
                errors: ["Produto não encontrado"],
            }
        }

        let imageUrl: string | null = existsProduct?.imageUrl ?? null;

        if (dto.photo) {
            imageUrl = (await uploadService.uploadFile(dto.photo, "products")).url;
        }

        const product = await prisma.product.update({
            where: {
                id: productId,
            },
            data: {
                name: dto.name,
                tag: dto.tag,
                imageUrl: imageUrl,
                price: dto.price,
                stock: dto.stock,
                categoryId: dto.categoryId,
            },
            select: {
                id: true,
            },
        });

        return {
            data: product,
            message: "Produto atualizado com sucesso",
            statusCode: 200,
            errors: [],
        }
    }
}
