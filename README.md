# VMWare MCP

MCP (Model Context Protocol) server that wraps VMware's `govc` CLI, exposing vSphere operations as typed tools for AI agents. Runs on **Bun**, communicates over stdio.

## Prerequisites

- [Bun](https://bun.sh/) ≥ 1.0
- [govc](https://github.com/vmware/govmomi/tree/main/govc) installed and in `PATH`
- Access to a vCenter / ESXi host

## Quick Start

```bash
bun install
cp .env.example .env   # fill in your credentials
source .env             # export vars for both govc CLI and the MCP server
bun run start           # start the MCP server on stdio
```

## Environment Variables

Create a `.env` file at the project root (already in `.gitignore`):

```bash
export GOVC_URL=https://vcenter.example.com/sdk
export GOVC_USERNAME=admin@vsphere.local
export GOVC_PASSWORD=secret
export GOVC_INSECURE=1
```

| Variable          | Required | Description                                  |
| ----------------- | -------- | -------------------------------------------- |
| `GOVC_URL`        | ✅       | vCenter / ESXi SDK URL                       |
| `GOVC_USERNAME`   | ✅       | vSphere username                             |
| `GOVC_PASSWORD`   | ✅       | vSphere password                             |
| `GOVC_INSECURE`   |          | Set `1` to skip TLS verification             |
| `GOVC_BIN`        |          | Path to `govc` binary (default: `govc`)      |
| `GOVC_TIMEOUT_MS` |          | Subprocess timeout in ms (default: `120000`) |

> Bun auto-loads `.env` files. The `export` prefix is kept so `source .env` also works for direct `govc` CLI usage.

## SSH Tunnel (remote vCenter)

If vCenter is only reachable from an internal network, create an SSH tunnel through a jump host:

```bash
# Terminal 1 — open the tunnel (keeps running)
sudo ssh -J <jump_user>@<jump_host> -L 443:<vcenter_host>:443 <user>@<internal_host> -N
```

Then set `GOVC_URL=https://localhost/sdk` in your `.env`. The `GOVC_INSECURE=1` flag is required since the TLS cert won't match `localhost`.

To use a non-privileged local port (no `sudo`):

```bash
ssh -J <jump_user>@<jump_host> -L 8443:<vcenter_host>:443 <user>@<internal_host> -N
```

Then set `GOVC_URL=https://localhost:8443/sdk`.

## Scripts

```bash
bun run start            # Run the MCP server (stdio)
bun run dev              # Run with --watch for development
bun run ui               # Launch MCP Inspector (web UI for testing)
bun run check            # Biome check + tsc --noEmit (CI gate)
bun run lint             # Biome lint only
bun run lint:fix         # Biome lint with auto-fix
bun run format           # Biome format with auto-write
bun run format:check     # Biome format check only
bun run typecheck        # TypeScript type checking only
bun run docker:build     # Build Docker image (linux/amd64)
```

## Testing Locally

The easiest way to test is the MCP Inspector:

```bash
bun run ui
```

This opens a web UI where you can browse all tools, call them with arguments, and inspect responses in real time.

## Architecture

```
src/
├── index.ts        # Entry point — MCP server setup, tool registration, env validation
├── commands.ts     # Command registry (GOVC_COMMAND_INDEX + GOVC_TOOL_DEFS)
├── generator.ts    # Converts GOVC_TOOL_DEFS → MCPTool objects with JSON Schema
├── executor.ts     # Spawns govc subprocesses, handles flags/timeout/JSON parsing
├── search.ts       # Fuzzy search over command index (Fuse.js)
└── httpServer.ts   # Minimal HTTP health-check server
```

The server exposes **3 meta tools** + all typed tools from `commands.ts`:

| Meta Tool     | Description                                        |
| ------------- | -------------------------------------------------- |
| `govc_search` | Fuzzy search across all registered commands        |
| `govc_help`   | Get `govc <cmd> -h` output for any command         |
| `govc_run`    | Escape hatch — run any govc command with raw flags |

Typed tools are auto-generated from `GOVC_TOOL_DEFS` in `commands.ts`. Each definition specifies the command name, description, typed flags with JSON Schema, and optional positional arguments.

## Adding a New Command

1. Add an entry to `GOVC_COMMAND_INDEX` in `commands.ts` (name, description, category).
2. Add a `GovcToolDef` to `GOVC_TOOL_DEFS` with the command name, description, typed flags, and optional `positionalArgs`.
3. No other changes needed — the generator wires everything automatically.
4. Run `bun run check` to validate.

## Docker

```bash
bun run docker:build

docker run --rm \
  -e GOVC_URL=https://vcenter.example.com/sdk \
  -e GOVC_USERNAME=admin@vsphere.local \
  -e GOVC_PASSWORD=secret \
  -e GOVC_INSECURE=1 \
  vmware-mcp
```

## Git Workflow

- **Never push directly to `main`** — create a feature branch and open a PR.
- Branch naming: `feature/<short-description>` or `fix/<short-description>`.
- Commit messages: conventional commits (`feat:`, `fix:`, `refactor:`, `chore:`, etc.).
- Always run `bun run check` before committing.
