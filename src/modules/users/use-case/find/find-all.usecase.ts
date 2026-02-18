import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { IApiResponse } from "../../../../utils/api-response.js";
import { prisma } from "../../../../config/prisma.connect.js";
import type { IBasePaginatedParams, IBasePaginatedResponse } from "../../../../base/pagination/pagination.interface.js";
import { BasePaginatedResponse } from "../../../../base/pagination/paginated-response.base.js";
import type { IFindAllUsersUseCaseResponse } from "./find-all.interface.js";

export class FindAllUsersUseCase
    implements IUseCase<
        IBasePaginatedParams,
        IBasePaginatedResponse<
            IFindAllUsersUseCaseResponse
        >
    > {

    async handle(
        params: IBasePaginatedParams
    ): Promise<IApiResponse<IBasePaginatedResponse<IFindAllUsersUseCaseResponse>>> {

        const countTotal = await prisma.user.count({
            where: {
                deletedAt: null,
                ...params.query
            },
        });

        const skip = (params.page - 1) * params.perPage;

        const items = await prisma.user.findMany({
            where: {
                deletedAt: null,
                ...params.query
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                cpf: true,
                company: {
                    select: {
                        id: true,
                        tradeName: true,
                        cnpj: true,
                    }
                },
            },
            skip: skip,
            take: params.perPage,
        });

        return {
            data: BasePaginatedResponse<IFindAllUsersUseCaseResponse>(
                params,
                countTotal,
                items
            ),
            message: "Usuários listados com sucesso",
            statusCode: 200,
            errors: [],
        };
    }
}
