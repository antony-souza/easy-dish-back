import { Router } from "express";
import * as productsController from "./products.controller.js";
import { validationBodyMiddleware } from "../../middlewares/validate-body.middleware.js";
import { createProductSchema } from "./use-case/create/schema/create.schema.js";
import { updateProductSchema } from "./use-case/update/schema/update.schema.js";
import { multerUpload } from "../../config/multer.config.js";

export const productsRoutes = Router();

productsRoutes.get("/", productsController.findAll);

productsRoutes.post("/",
    multerUpload.single("photo"),
    validationBodyMiddleware(createProductSchema),
    productsController.create
);

productsRoutes.put("/:id",
    multerUpload.single("photo"),
    validationBodyMiddleware(updateProductSchema),
    productsController.update
);
