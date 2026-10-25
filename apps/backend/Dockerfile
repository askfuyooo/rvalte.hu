FROM node:lts-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY apps/backend ./apps/backend
COPY packages ./packages

RUN npm ci
RUN npm run build
RUN npm run build -w @rvalte-hu/backend
RUN npm prune --omit=dev

FROM node:lts-alpine AS runner
WORKDIR /srv
ENV NODE_ENV=production

COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/server.js"]