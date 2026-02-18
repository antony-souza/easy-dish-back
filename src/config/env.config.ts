import "dotenv/config";
import z from "zod";

export const envSchema = z.object({
  PORT: z.string(),
  HOST: z.string(),
  DATABASE_URL: z.url(),
  X_API_TOKEN: z.string(),
  JWT_SECRET: z.string(),
  ORIGIN: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  REDIS_PASSWORD: z.string(),
  REDIS_DB: z.string(),
});

export const getEnvField = envSchema.parse(process.env);