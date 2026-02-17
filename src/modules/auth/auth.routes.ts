import { Router } from 'express';
import * as SignInController from "./auth.controller.js"
import { validationBodyMiddleware } from '../../middlewares/validate-body.middleware.js';
import { signInSchema } from './use-case/sign-in/schemas/sign-in.schema.js';

export const authRoutes = Router();

authRoutes.post('/sign-in',
    validationBodyMiddleware(signInSchema),
    SignInController.signIn
);