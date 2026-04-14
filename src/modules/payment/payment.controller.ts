import type { Request, Response } from "express";
import { genericResponseControllerUtil } from "../../utils/api-response.js";
import { CreatePaymentLinkUseCase } from "./use-case/payment-link/create-payment-link.usecase.js";

export const getServiceUseCase = () => {
    return {
        createPaymentLink: new CreatePaymentLinkUseCase(),
    };
};

export const createPaymentLink = async (req: Request, res: Response) => {
    const service = getServiceUseCase().createPaymentLink;

    const result = await service.handle({
        ...req.body,
        email: req.user!.email,
    });

    return genericResponseControllerUtil(result, res);
};