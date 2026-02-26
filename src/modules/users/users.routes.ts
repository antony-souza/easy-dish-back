import { Router } from "express";
import * as usersController from "./users.controller.js";
import { validationBodyMiddleware } from "../../middlewares/validate-body.middleware.js";
import { createUserSchema } from "./use-case/create/schema/create.schema.js";
import { updateUserSchema } from "./use-case/update/schema/update.schema.js";

export const usersRoutes = Router();

usersRoutes.get("/", usersController.findAll);

usersRoutes.post("/",
    validationBodyMiddleware(createUserSchema),
    usersController.create
);

usersRoutes.put("/",
    validationBodyMiddleware(updateUserSchema),
    usersController.update
);

