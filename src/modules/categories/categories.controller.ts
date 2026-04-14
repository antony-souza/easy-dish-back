import type { Request, Response } from "express";
import { genericResponseControllerUtil } from "../../utils/api-response.js";
import { FindAllCategoriesUseCase } from "./use-case/find/find-all.usecase.js";
import { FindAllCategoriesCachedUseCase } from "./use-case/find/find-all-cached.usecase.js";
import { CreateCategoryUseCase } from "./use-case/create/create.usecase.js";
import { UpdateCategoryUseCase, type IUpdateCategoryIdsParamsUseCase } from "./use-case/update/update.usecase.js";
import { DeleteCategoryUseCase } from "./use-case/delete/delete-usecase.js";

export const getServiceUseCase = () => {
    return {
        findAll: new FindAllCategoriesUseCase(),
        findAllCached: new FindAllCategoriesCachedUseCase(),
        create: new CreateCategoryUseCase(),
        update: new UpdateCategoryUseCase(),
        delete: new DeleteCategoryUseCase(),
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

export const findAllCached = async (req: Request, res: Response) => {
    const service = getServiceUseCase().findAllCached;

    const result = await service.handleWithId(req.user?.companyId as string);

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

export const softDelete = async (req: Request, res: Response) => {
    const service = getServiceUseCase().delete;
    const { id } = req.params as { id: string };

    const result = await service.handleWithId(id);

    return genericResponseControllerUtil(result, res);
}
