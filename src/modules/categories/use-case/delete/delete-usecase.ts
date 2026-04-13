import { prisma } from "../../../../config/prisma.connect.js";
import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { IApiResponse } from "../../../../utils/api-response.js";

export class DeleteCategoryUseCase implements IUseCase<string, null> {
    async handleWithId(id: string): Promise<IApiResponse<null>> {

        const existsCategory = await prisma.category.count({
            where: {
                id: id,
                deletedAt: null,
            },
        });

        if (!existsCategory) {
            return {
                data: null,
                message: "Categoria não encontrada",
                statusCode: 404,
                errors: ["Categoria não encontrada"],
            }
        }

        await prisma.category.update({
            where: {
                id: id,
            },
            data: {
                deletedAt: new Date(),
            },
        });

        return {
            data: null,
            message: "Categoria excluída com sucesso",
            statusCode: 200,
            errors: [],
        };

    }
}