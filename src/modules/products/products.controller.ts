import type { Request, Response } from "express";
import { genericResponseControllerUtil } from "../../utils/api-response.js";
import { FindAllProductsUseCase } from "./use-case/find/find-all.usecase.js";
import { CreateProductUseCase } from "./use-case/create/create.usecase.js";
import { UpdateProductUseCase } from "./use-case/update/update.usecase.js";
import { DeleteProductUseCase } from "./use-case/delete/delete-usecase.js";

export const getServiceUseCase = () => {
    return {
        findAll: new FindAllProductsUseCase(),
        create: new CreateProductUseCase(),
        update: new UpdateProductUseCase(),
        delete: new DeleteProductUseCase(),
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

    const result = await service.handleWithId(req.user!.companyId, {
        ...req.body,
        photo: req.file,
    });

    return genericResponseControllerUtil(result, res);
}

export const update = async (req: Request, res: Response) => {
    const service = getServiceUseCase().update;

    const { id } = req.params as { id: string };

    const result = await service.handleWithId(id, {
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

