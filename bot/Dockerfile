# Base Node
FROM node:18-bullseye-slim AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./

# Dependencies
FROM base AS deps
RUN apt-get update && apt-get install -y ca-certificates && \
  npm i -g pnpm && \
  pnpm i --frozen-lockfile --prod

# Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run generate && npm run build

# Runner
FROM node:18-bullseye-slim
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 8080
CMD ["npm", "run", "start"]
