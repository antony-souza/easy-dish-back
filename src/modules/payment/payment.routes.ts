import { Router } from "express";
import * as PaymentController from "./payment.controller.js";
import { validationBodyMiddleware } from "../../middlewares/validate-body.middleware.js";
import { createPreferenceSchema } from "./use-case/preference/schema/create-preference.schema.js";

export const paymentRoutes = Router();

paymentRoutes.post(
  "/create-preference",
  validationBodyMiddleware(createPreferenceSchema),
  PaymentController.createPreference
);