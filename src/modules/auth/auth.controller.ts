import type { Request, Response } from "express";
import { SignInServiceUseCase } from "./use-case/sign-in/sign-in.usecase.js"
import { ForgotPasswordServiceUseCase } from "./use-case/forgot-password/forgot-password.usecase.js";
import { ResetPasswordServiceUseCase } from "./use-case/reset-password/reset-password.usecase.js";
import { genericResponseControllerUtil } from "../../utils/api-response.js";

export const getServiceUseCase = () => {
   return {
    signIn: new SignInServiceUseCase(),
    forgotPassword: new ForgotPasswordServiceUseCase(),
    resetPassword: new ResetPasswordServiceUseCase(),
   }
}

export const signIn = async (req: Request, res: Response) => {
  const data = req.body;
  const service = getServiceUseCase().signIn;

  const result = await service.handle(data);

  return genericResponseControllerUtil(result, res);
}

export const forgotPassword = async (req: Request, res: Response) => {
  const data = req.body;
  const service = getServiceUseCase().forgotPassword;

  const result = await service.handle(data);

  return genericResponseControllerUtil(result, res);
}

export const resetPassword = async (req: Request, res: Response) => {
  const data = req.body;
  const service = getServiceUseCase().resetPassword;

  const result = await service.handle(data);

  return genericResponseControllerUtil(result, res);
}