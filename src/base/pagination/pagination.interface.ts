export interface IBasePaginatedParams {
    page: number;
    perPage: number;
    sortBy: string;
    sort: string;
    query: Record<string, unknown>;
}

export interface IBasePaginatedResponse<T> {
    page: number;
    perPage: number;
    countPage: number;
    sortBy: string;
    sort: string;
    total: number;
    items: T[];
}