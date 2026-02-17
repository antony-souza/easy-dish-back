import { Router } from 'express';
import * as SignInController from "./auth.controller.js"

export const authRoutes = Router();

authRoutes.post('/sign-in', SignInController.signIn);