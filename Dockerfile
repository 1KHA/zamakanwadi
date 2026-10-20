# syntax=docker/dockerfile:1
# Zamakan — container images. For local use run `docker compose up -d --build`
# (see docker-compose.yml); it uses the `migrate` and `runner` targets below.
#
# Runtime env (DATABASE_URL, NEXTAUTH_*, PAYMENT_PROVIDER, STRABL_*) is read when
# the container starts, so changing it only needs a restart, not a rebuild.

# ---- deps -------------------------------------------------------------------
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# ---- migrate (one-shot: schema + seeds for the local db) -------------------
# Has the Prisma CLI and tsx, which the slim runner image deliberately lacks.
FROM deps AS migrate
WORKDIR /app
COPY prisma ./prisma
COPY scripts ./scripts
COPY src ./src
COPY tsconfig.json ./
RUN npx prisma generate
CMD ["sh", "-c", "npx prisma db push --skip-generate \
  && npx tsx scripts/seed-spaces.ts \
  && npx tsx scripts/seed-features.ts \
  && npx tsx scripts/seed-admin.ts"]

# ---- build ------------------------------------------------------------------
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generates the Prisma client for this (alpine/musl) platform.
RUN npx prisma generate
RUN npm run build

# ---- run --------------------------------------------------------------------
FROM node:22-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Prisma's query engine is not always picked up by Next's file tracing.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma/client ./node_modules/@prisma/client

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
