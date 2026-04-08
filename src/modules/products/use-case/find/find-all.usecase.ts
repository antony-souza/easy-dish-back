import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { IApiResponse } from "../../../../utils/api-response.js";
import { prisma } from "../../../../config/prisma.connect.js";
import type { IBasePaginatedParams, IBasePaginatedResponse } from "../../../../base/pagination/pagination.interface.js";
import { BasePaginatedResponse } from "../../../../base/pagination/paginated-response.base.js";
import type { IFindAllProductsUseCaseResponse } from "./find-all.interface.js";

export class FindAllProductsUseCase
    implements IUseCase<
        IBasePaginatedParams,
        IBasePaginatedResponse<
            IFindAllProductsUseCaseResponse
        >
    > {

    async handle(
        params: IBasePaginatedParams
    ): Promise<IApiResponse<IBasePaginatedResponse<IFindAllProductsUseCaseResponse>>> {

        const countTotal = await prisma.product.count({
            where: {
                deletedAt: null,
                ...params.query
            },
        });

        const skip = (params.page - 1) * params.perPage;

        const items = await prisma.product.findMany({
            where: {
                deletedAt: null,
                ...params.query
            },
            select: {
                id: true,
                name: true,
                tag: true,
                imageUrl: true,
                price: true,
                stock: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                        tag: true,
                    },
                },
            },
            skip: skip,
            take: params.perPage,
        });

        return {
            data: BasePaginatedResponse<IFindAllProductsUseCaseResponse>(
                params,
                countTotal,
                items
            ),
            message: "Produtos listados com sucesso",
            statusCode: 200,
            errors: [],
        };
    }
}
