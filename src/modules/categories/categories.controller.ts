import type { Request, Response } from "express";
import { genericResponseControllerUtil } from "../../utils/api-response.js";
import { FindAllCategoriesUseCase } from "./use-case/find/find-all.usecase.js";
import { CreateCategoryUseCase } from "./use-case/create/create.usecase.js";
import { UpdateCategoryUseCase, type IUpdateCategoryIdsParamsUseCase } from "./use-case/update/update.usecase.js";

export const getServiceUseCase = () => {
    return {
        findAll: new FindAllCategoriesUseCase(),
        create: new CreateCategoryUseCase(),
        update: new UpdateCategoryUseCase(),
    }
}

export const findAll = async (req: Request, res: Response) => {
    const service = getServiceUseCase().findAll;

    const { page, perPage, sortBy, sort, ...rest } = req.query;

    const result = await service.handleWithId(req.user?.companyId as string, {
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

    const result = await service.handleWithId(req.user?.companyId as string, {
        ...req.body,
        photo: req.file,
    });

    return genericResponseControllerUtil(result, res);
}

export const update = async (req: Request, res: Response) => {
    const service = getServiceUseCase().update;

    const { id } = req.params as { id: string };

    const paramsIds = {
        categoryId: id,
        companyId: req.user?.companyId
    } as IUpdateCategoryIdsParamsUseCase;

    const result = await service.handleWithIds(paramsIds, {
        ...req.body,
        photo: req.file,
    });

    return genericResponseControllerUtil(result, res);
}
