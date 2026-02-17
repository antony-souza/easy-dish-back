import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export const validationBodyMiddleware = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map(
          (err) => `${err.message} ${err.path.join(".")}`
        );

        res.status(400).send({
          message: "Informações inválidas",
          errors: errorMessages,
        });
        return;
      }

      res.status(400).send(error);
    }
  };
};