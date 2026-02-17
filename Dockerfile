# ---------- BUILDER ----------
FROM node:22-alpine AS builder

WORKDIR /app

# dependência necessária pro Prisma no Alpine
RUN apk add --no-cache openssl

# instala deps com lockfile (reprodutível)
COPY package*.json ./
RUN npm ci

# copia código
COPY . .

# gera prisma client
RUN npx prisma generate

# build typescript
RUN npm run build


# ---------- RUNNER ----------
FROM node:22-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production

# copia apenas o necessário
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

# migração automática do banco antes de iniciar
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]