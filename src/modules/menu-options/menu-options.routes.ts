import { Router } from "express";
import * as menuOptionsController from "./menu-options.controller.js";
import { validationBodyMiddleware } from "../../middlewares/validate-body.middleware.js";
import { createMenuOptionSchema } from "./use-case/create/schema/create-menu-option.schema.js";

export const menuOptionsRoutes = Router();

menuOptionsRoutes.get("/", menuOptionsController.findAll);

menuOptionsRoutes.post("/",
    validationBodyMiddleware(createMenuOptionSchema),
    menuOptionsController.create
);
