FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production
COPY src/ ./src/

# Runtime: govc image + bun + MCP server
FROM vmware/govc:v0.52.0
COPY --from=oven/bun:1-alpine /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /app
COPY --from=builder /app ./

ENTRYPOINT ["bun", "run", "src/index.ts"]
