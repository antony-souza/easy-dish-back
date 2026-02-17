import type { Request, Response } from "express";
import { SignInServiceUseCase } from "./use-case/sign-in/sign-in.usecase.js"

export const getServiceUseCase = () => {
   return {
    signIn: new SignInServiceUseCase()
   }
}

export const signIn = async (req: Request, res: Response) => {
  const data = req.body;
  const service = getServiceUseCase().signIn;

  const result = await service.handle(data);
  return res.json(result);
}