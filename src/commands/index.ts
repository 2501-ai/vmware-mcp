// ---------------------------------------------------------------------------
// VMWare MCP – Command Registry Barrel
// ---------------------------------------------------------------------------
// Re-exports all command types, helpers, and data from the split modules.
// Runs a sync validation at import time to catch mismatches between
// GOVC_COMMAND_INDEX and GOVC_TOOL_DEFS.
// ---------------------------------------------------------------------------

export { GOVC_COMMAND_INDEX } from './commandIndex';
export { GOVC_TOOL_DEFS } from './toolDefs';
export type { FlagDef, GovcCommandEntry, GovcToolDef } from './types';
export { bool, CLUSTER, DS, FOLDER, HOST, NET, num, POOL, str, strEnum, VM } from './types';

// ---------------------------------------------------------------------------
// Sync validation: ensure every tool def has a matching search index entry
// and vice versa. Runs once at startup — mismatches log warnings.
// ---------------------------------------------------------------------------

import { GOVC_COMMAND_INDEX } from './commandIndex';
import { GOVC_TOOL_DEFS } from './toolDefs';

const toolCommands = new Set(GOVC_TOOL_DEFS.map((t) => t.command));
const indexCommands = new Set(GOVC_COMMAND_INDEX.map((c) => c.name));

for (const cmd of toolCommands) {
  if (!indexCommands.has(cmd)) {
    console.error(`⚠ Tool "${cmd}" has no search index entry in GOVC_COMMAND_INDEX`);
  }
}

for (const cmd of indexCommands) {
  if (!toolCommands.has(cmd)) {
    console.error(`⚠ Search index entry "${cmd}" has no matching tool def in GOVC_TOOL_DEFS`);
  }
}
