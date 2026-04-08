import { Router } from "express";
import * as categoriesController from "./categories.controller.js";
import { validationBodyMiddleware } from "../../middlewares/validate-body.middleware.js";
import { createCategorySchema } from "./use-case/create/schema/create.schema.js";
import { updateCategorySchema } from "./use-case/update/schema/update.schema.js";
import { multerUpload } from "../../config/multer.config.js";

export const categoriesRoutes = Router();

categoriesRoutes.get("/", categoriesController.findAll);

categoriesRoutes.post("/",
    multerUpload.single("photo"),
    validationBodyMiddleware(createCategorySchema),
    categoriesController.create
);

categoriesRoutes.put("/:id",
    multerUpload.single("photo"),
    validationBodyMiddleware(updateCategorySchema),
    categoriesController.update
);
