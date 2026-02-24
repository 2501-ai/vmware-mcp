# VMware MCP — Setup

First, copy and fill in your credentials:

```bash
cp .env.docker.example .env.docker   # edit with your vCenter URL, username & password
```

## Ephemeral (default)

A fresh container per connection, removed when done.

```bash
# Docker
docker run --rm -i --env-file .env.docker ghcr.io/2501-ai/vmware-mcp

# Claude Code
claude mcp add vmware-mcp -- docker run --rm -i --env-file .env.docker ghcr.io/2501-ai/vmware-mcp
```

## Persistent

The container runs as a long-lived service. Clients connect via `docker exec`.

```bash
# Docker (once)
docker run -d --name vmware-mcp --restart unless-stopped \
  --env-file .env.docker -e MCP_KEEP_ALIVE=true ghcr.io/2501-ai/vmware-mcp

# Claude Code
claude mcp add vmware-mcp -- docker exec -i vmware-mcp vmware-mcp
```

---

Restart Claude Code after running `claude mcp add`. Tools appear as `mcp__vmware-mcp__*`. Check status with `/mcp`.