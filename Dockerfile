# Stage 1: Get govc from official image
FROM vmware/govc:v0.52.0 AS govc

# Stage 2: Install dependencies
FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production
COPY src/ ./src/

# Stage 3: Runtime
FROM oven/bun:1-alpine
WORKDIR /app

COPY --from=govc /govc /usr/local/bin/govc
COPY --from=builder /app ./

ENTRYPOINT ["bun", "run", "src/index.ts"]
