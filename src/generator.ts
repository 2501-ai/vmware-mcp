import { GOVC_TOOL_DEFS, type GovcToolDef } from './commands';
import { type GovcResult, makeHandler } from './executor';

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
  handler: (args: Record<string, unknown>) => Promise<GovcResult>;
}

/** govc command name → valid MCP tool name: dots → underscores */
const toToolName = (command: string): string => command.replace(/\./g, '_');

const flagToJsonSchema = (flag: { type: string; description: string; enum?: string[] }): Record<string, unknown> => {
  const schema: Record<string, unknown> = {
    type: flag.type === 'boolean' ? 'boolean' : flag.type === 'number' ? 'number' : 'string',
    description: flag.description,
  };
  if (flag.enum) schema.enum = flag.enum;
  return schema;
};

const generateTool = (def: GovcToolDef): MCPTool => {
  const properties: Record<string, unknown> = {};
  const required: string[] = [];

  for (const [key, flag] of Object.entries(def.flags)) {
    properties[key] = flagToJsonSchema(flag);
    if (flag.required) required.push(key);
  }

  if (def.positionalArgs) {
    properties._args = {
      type: 'string',
      description: `Positional arguments: ${def.positionalArgs}. Space-separated values.`,
    };
  }

  return {
    name: toToolName(def.command),
    description: `[govc ${def.command}] ${def.description}`,
    inputSchema: {
      type: 'object',
      properties,
      ...(required.length > 0 && { required }),
    },
    handler: makeHandler(def),
  };
};

export const generateMCPTools = (): MCPTool[] => GOVC_TOOL_DEFS.map(generateTool);
