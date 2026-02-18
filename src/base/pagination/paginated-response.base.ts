import type { IBasePaginatedParams, IBasePaginatedResponse } from "./pagination.interface.js";

export function BasePaginatedResponse<T>(
    params: IBasePaginatedParams,
    countTotal: number,
    items: T[],
): IBasePaginatedResponse<T> {

    const countPage = Math.ceil(countTotal / params.perPage);

    return {
        page: params.page,
        perPage: params.perPage,
        countPage: countPage,
        sortBy: params.sortBy,
        sort: params.sort,
        total: countTotal,
        items: items,
    };
}