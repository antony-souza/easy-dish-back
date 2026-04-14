import { prisma } from "../../../../config/prisma.connect.js";
import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { IApiResponse } from "../../../../utils/api-response.js";

export class DeleteProductUseCase implements IUseCase<string, null> {
    async handleWithId(id: string): Promise<IApiResponse<null>> {

        const existsProduct = await prisma.product.count({
            where: {
                id: id,
                deletedAt: null,
            },
        });

        if (!existsProduct) {
            return {
                data: null,
                message: "Produto não encontrado",
                statusCode: 404,
                errors: ["Produto não encontrado"],
            }
        }

        await prisma.product.update({
            where: {
                id: id,
            },
            data: {
                deletedAt: new Date(),
            },
        });

        return {
            data: null,
            message: "Produto excluído com sucesso",
            statusCode: 200,
            errors: [],
        };

    }
}