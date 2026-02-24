// ---------------------------------------------------------------------------
// VMWare MCP – Command Registry Types & Helpers
// ---------------------------------------------------------------------------

// ---- Types ----------------------------------------------------------------

export interface FlagDef {
  type: 'string' | 'number' | 'boolean';
  description: string;
  required?: boolean;
  default?: string | number | boolean;
  enum?: string[];
}

export interface GovcToolDef {
  /** govc command name, e.g. "vm.info" */
  command: string;
  description: string;
  flags: Record<string, FlagDef>;
  /** Description of positional args (empty string = none) */
  positionalArgs?: string;
}

export interface GovcCommandEntry {
  name: string;
  description: string;
  category: string;
}

// ---- Helpers (compact flag builders) --------------------------------------

export const str = (description: string, required = false): FlagDef => ({
  type: 'string',
  description,
  required,
});

export const num = (description: string, required = false): FlagDef => ({
  type: 'number',
  description,
  required,
});

export const bool = (description: string): FlagDef => ({
  type: 'boolean',
  description,
});

export const strEnum = (description: string, values: string[]): FlagDef => ({
  type: 'string',
  description,
  enum: values,
});

// ---- Common flag groups ---------------------------------------------------

export const VM = { vm: str('Virtual machine [GOVC_VM]') };
export const HOST = { host: str('Host system [GOVC_HOST]') };
export const DS = { ds: str('Datastore [GOVC_DATASTORE]') };
export const CLUSTER = { cluster: str('Cluster [GOVC_CLUSTER]') };
export const FOLDER = { folder: str('Inventory folder [GOVC_FOLDER]') };
export const POOL = { pool: str('Resource pool [GOVC_RESOURCE_POOL]') };
export const NET = { net: str('Network [GOVC_NETWORK]') };
