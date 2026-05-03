import { Router } from "express";
import * as verifyCodeController from "./verify-code.controller.js"

export const verifyCodeRoutes = Router();

verifyCodeRoutes.post("/",
    verifyCodeController.create
);

verifyCodeRoutes.post("/verify",
    verifyCodeController.verify
);

