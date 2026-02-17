import { PrismaPg } from "@prisma/adapter-pg";
import { getEnvField } from "./env.config.js";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = getEnvField.DATABASE_URL;

export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});