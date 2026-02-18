import type { Request, Response } from "express";
import { genericResponseControllerUtil } from "../../utils/api-response.js";
import { FindAllMenuOptionsUseCase } from "./use-case/find/find-all.usecase.js";
import { CreateMenuOptionUseCase } from "./use-case/create/create.usecase.js";

export const getServiceUseCase = () => {
    return {
        findAll: new FindAllMenuOptionsUseCase(),
        create: new CreateMenuOptionUseCase(),
    }
}

export const findAll = async (req: Request, res: Response) => {
    const service = getServiceUseCase().findAll;

    const result = await service.handle(req.user!.roleId);

    return genericResponseControllerUtil(result, res);
}

export const create = async (req: Request, res: Response) => {
    const service = getServiceUseCase().create;

    const result = await service.handle(req.body);

    return genericResponseControllerUtil(result, res);
}
