import { Router } from 'express';
import * as AuthController from "./auth.controller.js"
import { validationBodyMiddleware } from '../../middlewares/validate-body.middleware.js';
import { signInSchema } from './use-case/sign-in/schemas/sign-in.schema.js';
import { forgotPasswordSchema } from './use-case/forgot-password/schemas/forgot-password.schema.js';
import { resetPasswordSchema } from './use-case/reset-password/schemas/reset-password.schema.js';

export const authRoutes = Router();

authRoutes.post('/sign-in',
    validationBodyMiddleware(signInSchema),
    AuthController.signIn
);

authRoutes.post('/forgot-password',
    validationBodyMiddleware(forgotPasswordSchema),
    AuthController.forgotPassword
);

authRoutes.post('/reset-password',
    validationBodyMiddleware(resetPasswordSchema),
    AuthController.resetPassword
);