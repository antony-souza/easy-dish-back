import { Router } from "express";
import * as usersController from "./users.controller.js";
import { validationBodyMiddleware } from "../../middlewares/validate-body.middleware.js";
import { createUserSchema } from "./use-case/create/schema/create.schema.js";

export const usersRoutes = Router();

usersRoutes.get("/", usersController.findAll);

usersRoutes.post("/",
    validationBodyMiddleware(createUserSchema),
    usersController.create
);
