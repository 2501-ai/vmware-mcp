# Stage 1: Install govc
FROM alpine:3.21 AS govc-builder
ARG GOVC_VERSION=0.52.0
ARG TARGETARCH
RUN wget -qO- "https://github.com/vmware/govmomi/releases/download/v${GOVC_VERSION}/govc_Linux_$(uname -m).tar.gz" \
    | tar xzf - -C /usr/local/bin govc \
    && chmod +x /usr/local/bin/govc

# Stage 2: Build the MCP server
FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production
COPY src/ ./src/

# Stage 3: Runtime
FROM oven/bun:1-alpine
WORKDIR /app

COPY --from=govc-builder /usr/local/bin/govc /usr/local/bin/govc
COPY --from=builder /app ./

ENTRYPOINT ["bun", "run", "src/index.ts"]
