import { Router } from "express";
import * as PaymentController from "./payment.controller.js";
import { validationBodyMiddleware } from "../../middlewares/validate-body.middleware.js";
import { createPaymentLinkSchema } from "./use-case/payment-link/schema/create-payment-link.schema.js";

export const paymentRoutes = Router();

paymentRoutes.post(
  "/create-payment-link",
  validationBodyMiddleware(createPaymentLinkSchema),
  PaymentController.createPaymentLink
);