FROM node:lts-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY apps/frontend ./apps/frontend
COPY packages ./packages

RUN npm ci
RUN npm run build
RUN npm run build -w @rvalte-hu/frontend
RUN npm prune --omit=dev

FROM caddy:2-alpine
WORKDIR /srv

ENV NODE_ENV=production

COPY --from=builder /app/apps/frontend/dist ./.
COPY apps/frontend/Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
EXPOSE 443
EXPOSE 443/udp