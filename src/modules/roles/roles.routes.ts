import { Router } from "express";
import * as rolesController from "./roles.controller.js";
import { validationBodyMiddleware } from "../../middlewares/validate-body.middleware.js";
import { createRoleSchema } from "./use-case/create/schema/create-role.schema.js";

import { needAuthMiddleware } from "../../middlewares/auth.middleware.js";

export const rolesRoutes = Router();

rolesRoutes.get("/", needAuthMiddleware, rolesController.findAll);

rolesRoutes.get("/public", rolesController.findAllPublic);

rolesRoutes.post("/",
    needAuthMiddleware,
    validationBodyMiddleware(createRoleSchema),
    rolesController.create
);
