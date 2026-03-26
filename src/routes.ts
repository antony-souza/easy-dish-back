import { Router } from 'express';
import { authRoutes } from './modules/auth/auth.routes.js';
import { rolesRoutes } from './modules/roles/roles.routes.js';
import { ApiTokenMiddleware } from './middlewares/api-token.middleware.js';
import { usersRoutes } from './modules/users/users.routes.js';
import { menuOptionsRoutes } from './modules/menu-options/menu-options.routes.js';
import { needAuthMiddleware } from './middlewares/auth.middleware.js';

export const apiRoutes = Router();

apiRoutes.use(ApiTokenMiddleware);
apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/roles', rolesRoutes);
apiRoutes.use('/users', usersRoutes);

apiRoutes.use(needAuthMiddleware)
apiRoutes.use('/menu-options', menuOptionsRoutes);
