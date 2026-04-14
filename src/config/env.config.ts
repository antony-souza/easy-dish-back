import "dotenv/config";
import z from "zod";

export const envSchema = z.object({
  PORT: z.string(),
  HOST: z.string(),
  DATABASE_URL: z.url(),
  X_API_TOKEN: z.string(),
  JWT_SECRET: z.string(),
  FRONTEND_URL: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  REDIS_PASSWORD: z.string(),
  REDIS_DB: z.string(),
  MERCADOPAGO_ACCESS_TOKEN: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string(),
  SMTP_SECURE: z.string(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  BCRYPT_SALT: z.string(),
  R2_ACCOUNT_ID: z.string(),
  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  R2_BUCKET_NAME: z.string(),
  R2_PUBLIC_URL: z.string(),
});

export const getEnvField = envSchema.parse(process.env);