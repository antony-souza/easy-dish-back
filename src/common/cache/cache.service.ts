import { Redis } from "ioredis"
import { getEnvField } from "../../config/env.config.js"

export class CacheService {
    private redis: Redis;

    constructor() {
        this.redis = new Redis({
            host: getEnvField.REDIS_HOST,
            port: Number(getEnvField.REDIS_PORT),
            password: getEnvField.REDIS_PASSWORD,
            db: Number(getEnvField.REDIS_DB),
        })
    }

    public async get<T>(key: string): Promise<T | null> {
        const data = await this.redis.get(key);

        if (!data) return null;

        try {
            return JSON.parse(data) as T;
        } catch {
            return null;
        }
    }
    public async set(key: string, value: unknown, ttl?: number): Promise<void> {
        if (ttl) {
            await this.redis.set(key, JSON.stringify(value), "EX", ttl);
        } else {
            await this.redis.set(key, JSON.stringify(value));
        }
    }

    public async del(key: string): Promise<void> {
        await this.redis.del(key);
    }
}
