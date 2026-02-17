# CLAUDE.md

## Project Overview

**VMWare MCP** is an MCP (Model Context Protocol) server that wraps VMware's `govc` CLI tool, exposing vSphere operations as typed MCP tools for AI agents. It runs on **Bun** and communicates over stdio.

## Commands

```bash
bun install              # Install dependencies
bun run start            # Run the MCP server (requires GOVC_* env vars)
bun run dev              # Run with --watch for development
bun run ui               # Launch MCP Inspector (web UI for testing tools)
bun run check            # Run biome check + tsc --noEmit (the full CI gate)
bun run lint             # Biome lint only
bun run lint:fix         # Biome lint with auto-fix
bun run format           # Biome format with auto-write
bun run format:check     # Biome format check only
bun run typecheck        # TypeScript type checking only
bun run docker:build     # Build Docker image (linux/amd64)
```

**The primary check command is `bun run check`** — always run this before committing. It runs both biome and tsc.

## Architecture

All source code lives in `src/`:

- **`index.ts`** — Entry point. Sets up the MCP server, registers tool handlers (ListTools + CallTool), validates `GOVC_URL`/`GOVC_USERNAME`/`GOVC_PASSWORD` env vars. Exposes 3 meta tools (`govc_search`, `govc_help`, `govc_run`) plus all typed tools from the generator.
- **`commands.ts`** — Command registry. Two data structures:
  - `GOVC_COMMAND_INDEX` — flat list of command entries (name + description + category) used by fuzzy search.
  - `GOVC_TOOL_DEFS` — typed tool definitions with flag schemas, used to generate MCP tools.
- **`generator.ts`** — Converts `GOVC_TOOL_DEFS` into `MCPTool` objects with JSON Schema `inputSchema` and bound handlers.
- **`executor.ts`** — Spawns `govc` subprocesses via `Bun.spawn`. Handles flag building, timeout, JSON parsing, and error wrapping. Exports `execGovc`, `execGovcHelp`, `makeHandler`, `splitArgs`.
- **`search.ts`** — Fuzzy search over `GOVC_COMMAND_INDEX` using Fuse.js.
- **`httpServer.ts`** — Minimal HTTP health-check server (not the main transport).

## Code Style & Conventions

- **Formatter/Linter**: Biome (not ESLint/Prettier).
- **Quotes**: Single quotes (enforced by biome).
- **Semicolons**: Always.
- **Trailing commas**: Always.
- **Indent**: 2 spaces.
- **Line width**: 120.
- **No `any`**: `noExplicitAny` is set to `error`. Use `unknown` instead.
- **Unused variables**: Warning (prefix with `_` if intentional).
- **Unused imports**: Error.
- **Import types**: Use `import type` for type-only imports (enforced).
- **Node built-ins**: Use `node:` protocol (e.g., `import http from 'node:http'`).
- **TypeScript**: Strict mode with `noUncheckedIndexedAccess`, `noImplicitReturns`, `verbatimModuleSyntax`.

## Adding a New govc Command

1. Add an entry to `GOVC_COMMAND_INDEX` in `commands.ts` (name, description, category).
2. Add a `GovcToolDef` to `GOVC_TOOL_DEFS` with the command name, description, typed flags, and optional `positionalArgs`.
3. The generator and handler wiring is automatic — no changes needed elsewhere.
4. Run `bun run check` to validate.

## Git Workflow

- **Never push directly to `main`**. Always create a feature branch and open a PR.
- Branch naming: `feature/<short-description>` or `fix/<short-description>`.
- Commit messages: conventional commits style (`feat:`, `fix:`, `refactor:`, `chore:`, etc.).

## Environment Variables

Create a `.env` file at the project root (already in `.gitignore`). The `export` prefix is intentional so `source .env` works for direct `govc` CLI usage — Bun (≥ 1.0.22) handles it fine:

```bash
export GOVC_URL=https://vcenter.example.com/sdk
export GOVC_USERNAME=admin@vsphere.local
export GOVC_PASSWORD=secret
export GOVC_INSECURE=1
```

Required at runtime:

- `GOVC_URL` — vCenter / ESXi SDK URL
- `GOVC_USERNAME` — vSphere username
- `GOVC_PASSWORD` — vSphere password

Optional:

- `GOVC_INSECURE` — Set to `1` to skip TLS verification
- `GOVC_BIN` — Path to govc binary (default: `govc`)
- `GOVC_TIMEOUT_MS` — Subprocess timeout in ms (default: `120000`)

## SSH Tunnel (remote vCenter)

If vCenter is only reachable from an internal network via a jump host:

```bash
# Terminal 1 — open the tunnel (keeps running in foreground)
sudo ssh -J <jump_user>@<jump_host> -L 443:<vcenter_host>:443 <user>@<internal_host> -N

# Then in .env:
# export GOVC_URL=https://localhost/sdk
```

To avoid `sudo`, use a high local port:

```bash
ssh -J <jump_user>@<jump_host> -L 8443:<vcenter_host>:443 <user>@<internal_host> -N

# Then in .env:
# export GOVC_URL=https://localhost:8443/sdk
```

`GOVC_INSECURE=1` is required when tunnelling since the TLS cert won't match `localhost`.

## Testing Locally

1. Fill in `.env` and `source .env`.
2. Verify govc works directly: `govc about`.
3. Launch the MCP Inspector: `bun run ui` — this opens a web UI to browse tools, call them, and inspect responses.
