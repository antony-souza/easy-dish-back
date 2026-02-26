import express from 'express';
import { apiRoutes } from './routes.js';
import { getEnvField } from './config/env.config.js';
import cors from 'cors';

export function main() {
    const app = express();

    app.use(express.json());

    app.use(cors({
        origin: getEnvField.FRONTEND_URL,
    }));

    app.use('/api', apiRoutes);

    app.listen({ host: getEnvField.HOST, port: getEnvField.PORT }, () => {
        console.log(`Server is running on ${getEnvField.HOST}:${getEnvField.PORT}`);
    });
}

main();
