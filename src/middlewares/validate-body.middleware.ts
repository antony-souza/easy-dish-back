import type { NextFunction, Request, RequestHandler, Response } from "express";
import z from "zod";

export const validationBodyMiddleware = (
  schema: z.ZodSchema
): RequestHandler => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: validationResult.error.issues,
      });
      return;
    }

    req.body = validationResult.data;

    next();
  };
};