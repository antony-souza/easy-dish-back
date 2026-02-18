import type { Request, Response } from "express";
import { genericResponseControllerUtil } from "../../utils/api-response.js";
import { FindAllRolesUseCase } from "./use-case/find/find-all.usecase.js";
import { CreateRoleUseCase } from "./use-case/create/create.usecase.js";
import { FindAllPublicRolesUseCase } from "./use-case/find/find-all-public.usecase.js";

export const getServiceUseCase = () => {
    return {
        findAll: new FindAllRolesUseCase(),
        findAllPublic: new FindAllPublicRolesUseCase(),
        create: new CreateRoleUseCase(),
    }
}

export const findAll = async (req: Request, res: Response) => {
    const service = getServiceUseCase().findAll;

    const result = await service.handle();

    return genericResponseControllerUtil(result, res);
}

export const findAllPublic = async (req: Request, res: Response) => {
    const service = getServiceUseCase().findAllPublic;

    const result = await service.handle();

    return genericResponseControllerUtil(result, res);
}

export const create = async (req: Request, res: Response) => {
    const service = getServiceUseCase().create;

    const result = await service.handle(req.body);

    return genericResponseControllerUtil(result, res);
}

