import type { Request, Response } from "express";
import { genericResponseControllerUtil } from "../../utils/api-response.js";
import { FindAllUsersUseCase } from "./use-case/find/find-all.usecase.js";
import { CreateUserUseCase } from "./use-case/create/create.usecase.js";

export const getServiceUseCase = () => {
    return {
        findAll: new FindAllUsersUseCase(),
        create: new CreateUserUseCase(),
    }
}

export const findAll = async (req: Request, res: Response) => {
    const service = getServiceUseCase().findAll;

    const { page, perPage, sortBy, sort, ...rest } = req.query;

    const result = await service.handle({
        page: Number(page) || 1,
        perPage: Number(perPage) || 10,
        sortBy: sortBy as string || "createdAt",
        sort: sort as string || "desc",
        query: rest as Record<string, unknown>,
    });

    return genericResponseControllerUtil(result, res);
}

export const create = async (req: Request, res: Response) => {
    const service = getServiceUseCase().create;

    const result = await service.handle(req.body);

    return genericResponseControllerUtil(result, res);
}

