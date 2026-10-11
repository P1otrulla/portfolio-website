# syntax=docker/dockerfile:1

# ---------- 1. zależności ----------
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---------- 2. build ----------
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Config Payload wymaga tych zmiennych już przy imporcie – w buildzie nie łączymy się z bazą.
ENV NEXT_TELEMETRY_DISABLED=1 \
    PAYLOAD_SECRET=build-time-placeholder \
    DATABASE_URL=postgres://build:build@localhost:5432/build
RUN mkdir -p public && npm run build

# ---------- 3. obraz produkcyjny ----------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    MEDIA_DIR=/app/media

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs \
 && mkdir -p /app/media /app/.next && chown -R nextjs:nodejs /app/media /app/.next

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
# Migracje bazy i dane startowe uruchamiają się same przy pierwszym starcie (payload.config.ts).
CMD ["node", "server.js"]
