import type { NextFunction, Request, Response } from 'express';
import { getEnvField } from '../config/env.config.js';

export function ApiTokenMiddleware(req: Request, res: Response, next: NextFunction) {
  const xApiToken = req.headers['x-api-token'];

  if (xApiToken === getEnvField.X_API_TOKEN) return next();

  return res.status(401).json({ message: 'Não autorizado' });
}

