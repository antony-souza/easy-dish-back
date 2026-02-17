FROM node:22-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl
COPY package*.json ./

COPY .env.prod .env
RUN npm i
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm i

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN npx prisma generate

COPY .env.prod .env

CMD ["node", "dist/src/main.js"]
