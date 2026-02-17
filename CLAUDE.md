# CLAUDE.md

## Key Commands

- `bun run check` — **always run before committing** (biome + tsc)
- `bun run ui` — MCP Inspector for local testing

## Code Rules

- Biome, not ESLint/Prettier. Single quotes, semicolons, trailing commas, 2-space indent, 120 line width.
- No `any` — use `unknown`. `noExplicitAny` is `error`.
- Use `import type` for type-only imports.
- Use `node:` protocol for Node built-ins.
- TypeScript strict mode with `noUncheckedIndexedAccess`, `noImplicitReturns`, `verbatimModuleSyntax`.

## Adding a govc Command

1. Add entry to `GOVC_COMMAND_INDEX` in `src/commands.ts`.
2. Add `GovcToolDef` to `GOVC_TOOL_DEFS` with typed flags.
3. Generator wires it automatically — no other files to touch.
4. `bun run check`.

## Git

- **Never push to `main`**. Feature branch + PR.
- Branch: `feature/<x>` or `fix/<x>`.
- Commits: conventional (`feat:`, `fix:`, `refactor:`, `chore:`).

## .env

Uses `export` prefix so both `source .env` (for govc CLI) and Bun auto-load work. See `.env.example`.
