import type { Request, Response } from "express";
import { CreateVerifyCodeUseCase } from "./use-case/create/create.usecase.js";
import { VerifyCodeUseCase } from "./use-case/find/verify-code.usecase.js";
import { genericResponseControllerUtil } from "../../utils/api-response.js";
import { ResendCodeUseCase } from "./use-case/find/resend.usecase.js";


export const getServiceUseCase = () => {
    return {
        create: new CreateVerifyCodeUseCase(),
        verify: new VerifyCodeUseCase(),
        resend: new ResendCodeUseCase()
    }
}


export const create = async (req: Request, res: Response) => {
    const service = getServiceUseCase().create;

    const result = await service.handle(req.body);

    return genericResponseControllerUtil(result, res);
}

export const verify = async (req: Request, res: Response) => {
    const service = getServiceUseCase().verify;

    const result = await service.handle(req.body);

    return genericResponseControllerUtil(result, res);
}

export const resend = async (req: Request, res: Response) => {
    if(!req.user) return
    const service = getServiceUseCase().resend;

    const result = await service.handle({userId: req.user.id, email: req.user.email});

    return genericResponseControllerUtil(result, res);
}


