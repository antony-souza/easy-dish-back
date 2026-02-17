import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { getEnvField } from "./env.config.js";

const connectionString = getEnvField.DATABASE_URL;

export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});