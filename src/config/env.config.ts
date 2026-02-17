import "dotenv/config";
import z from "zod";

export const envSchema = z.object({
  PORT: z.string(),
  HOST: z.string(),
  DATABASE_URL: z.url(),
  X_API_TOKEN: z.string(),
});

export const getEnvField = envSchema.parse(process.env);