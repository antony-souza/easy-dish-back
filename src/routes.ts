import { Router } from 'express';
import { authRoutes } from './modules/auth/auth.routes.js';
import { rolesRoutes } from './modules/roles/roles.routes.js';
import { ApiTokenMiddleware } from './middlewares/api-token.middleware.js';

export const apiRoutes = Router();

apiRoutes.use(ApiTokenMiddleware);

apiRoutes.use('/auth', authRoutes);

apiRoutes.use('/roles', rolesRoutes);
