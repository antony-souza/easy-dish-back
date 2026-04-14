import type { Request, Response } from "express";
import { genericResponseControllerUtil } from "../../utils/api-response.js";
import { CreatePreferenceUseCase } from "./use-case/preference/create-preference.usecase.js";

export const getServiceUseCase = () => {
    return {
        createPreference: new CreatePreferenceUseCase(),
    };
};

export const createPreference = async (req: Request, res: Response) => {
    const service = getServiceUseCase().createPreference;

    const result = await service.handle({
        ...req.body,
        email: req.user!.email,
    });

    return genericResponseControllerUtil(result, res);
};