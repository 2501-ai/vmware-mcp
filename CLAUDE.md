# CLAUDE.md

## Key Commands

- `bun run check` — **always run before committing** (biome + tsc)
- `bun run ui` — MCP Inspector for local testing
- `bun run docker:build` — build Docker image (native arch, local dev)
- `bun run docker:build:ci` — build Docker image (linux/amd64, CI)

## Code Rules

- Biome, not ESLint/Prettier. Single quotes, semicolons, trailing commas, 2-space indent, 120 line width.
- No `any` — use `unknown`. `noExplicitAny` is `error`.
- Use `import type` for type-only imports.
- Use `node:` protocol for Node built-ins.
- TypeScript strict mode with `noUncheckedIndexedAccess`, `noImplicitReturns`, `verbatimModuleSyntax`.

## Adding a govc Command

1. Add entry to `GOVC_COMMAND_INDEX` in `src/commands/commandIndex.ts`.
2. Add `GovcToolDef` to `GOVC_TOOL_DEFS` in `src/commands/toolDefs.ts` with typed flags.
3. Types, flag helpers (`str`, `bool`, `num`, `strEnum`), and common flag groups (`VM`, `HOST`, etc.) live in `src/commands/types.ts`.
4. Barrel re-export is in `src/commands/index.ts` — it also runs a startup sync check that warns if the index and tool defs are out of sync.
5. Generator wires it automatically — no other files to touch.
6. `bun run check`.

## .env

- `.env` — uses `export` prefix so both `source .env` (for govc CLI) and Bun auto-load work. See `.env.example`.
- `.env.docker` — plain `KEY=VALUE` format (no `export`) for Docker `--env-file`. See `.env.docker.example`.

## Housekeeping

When making changes to the project, keep this file up to date. If you add scripts, change conventions, or alter the workflow, update the relevant section here. This file should stay short — directives only, no duplication of the README.
