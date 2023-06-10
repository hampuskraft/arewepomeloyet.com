# Base Node
FROM node:18-bullseye-slim AS base
WORKDIR /app
ENV NODE_ENV=production \
  NEXT_TELEMETRY_DISABLED=1 \
  PORT=3000

# Dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN apt-get update && \
  apt-get install -y npm && \
  npm i --global pnpm && \
  pnpm i --frozen-lockfile

# Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --mount=type=secret,id=DATABASE_URL \
  echo DATABASE_URL="$(cat /run/secrets/DATABASE_URL)" > .env
RUN npm run migrate && npm run generate && npm run build

# Runner
FROM base AS runner
RUN addgroup --system nextjs && adduser --system --ingroup nextjs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
