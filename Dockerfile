# Stage 1: Download govc for the correct architecture
FROM alpine:3.21 AS govc-builder
ARG GOVC_VERSION=0.52.0
RUN apk add --no-cache curl && \
    ARCH=$(uname -m | sed 's/aarch64/arm64/' | sed 's/x86_64/x86_64/') && \
    curl -fsSL "https://github.com/vmware/govmomi/releases/download/v${GOVC_VERSION}/govc_Linux_${ARCH}.tar.gz" \
    | tar xzf - -C /usr/local/bin govc && \
    chmod +x /usr/local/bin/govc

# Stage 2: Install dependencies
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
