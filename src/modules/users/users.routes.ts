import { Router } from "express";
import * as usersController from "./users.controller.js";
import { validationBodyMiddleware } from "../../middlewares/validate-body.middleware.js";
import { createUserSchema } from "./use-case/create/schema/create.schema.js";
import { updateUserSchema } from "./use-case/update/schema/update.schema.js";

import { needAuthMiddleware } from "../../middlewares/auth.middleware.js";

export const usersRoutes = Router();

usersRoutes.get("/my-info",
    needAuthMiddleware,
    usersController.myInfo
);

usersRoutes.get("/", needAuthMiddleware, usersController.findAll);

usersRoutes.post("/",
    validationBodyMiddleware(createUserSchema),
    usersController.create
);

usersRoutes.put("/",
    needAuthMiddleware,
    validationBodyMiddleware(updateUserSchema),
    usersController.update
);

