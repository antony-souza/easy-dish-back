import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { IApiResponse } from "../../../../utils/api-response.js";
import { prisma } from "../../../../config/prisma.connect.js";
import type { IBasePaginatedParams, IBasePaginatedResponse } from "../../../../base/pagination/pagination.interface.js";
import { BasePaginatedResponse } from "../../../../base/pagination/paginated-response.base.js";
import type { IFindAllCategoriesUseCaseResponse } from "./find-all.interface.js";

export class FindAllCategoriesUseCase
    implements IUseCase<
        IBasePaginatedParams,
        IBasePaginatedResponse<
            IFindAllCategoriesUseCaseResponse
        >
    > {

    async handle(
        params: IBasePaginatedParams
    ): Promise<IApiResponse<IBasePaginatedResponse<IFindAllCategoriesUseCaseResponse>>> {

        const countTotal = await prisma.category.count({
            where: {
                deletedAt: null,
                ...params.query
            },
        });

        const skip = (params.page - 1) * params.perPage;

        const items = await prisma.category.findMany({
            where: {
                deletedAt: null,
                ...params.query
            },
            select: {
                id: true,
                name: true,
                tag: true,
                imageUrl: true,
            },
            skip: skip,
            take: params.perPage,
        });

        return {
            data: BasePaginatedResponse<IFindAllCategoriesUseCaseResponse>(
                params,
                countTotal,
                items
            ),
            message: "Categorias listadas com sucesso",
            statusCode: 200,
            errors: [],
        };
    }
}
