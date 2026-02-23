import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { execGovc, execGovcHelp, splitArgs } from './executor';
import { formatForLLM } from './formatter';
import { generateMCPTools } from './generator';
import { startHttpServer } from './httpServer';
import { searchCommands } from './search';

// ---------------------------------------------------------------------------
// Validate required env vars
// ---------------------------------------------------------------------------

const REQUIRED_ENV = ['GOVC_URL', 'GOVC_USERNAME', 'GOVC_PASSWORD'];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);

if (missing.length) {
  console.error(`✗ Missing required env vars: ${missing.join(', ')}`);
  console.error('  Set GOVC_URL, GOVC_USERNAME, GOVC_PASSWORD (and optionally GOVC_INSECURE=true)');
  process.exit(1);
}

console.error('✓ govc credentials configured');

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------

const server = new Server({ name: 'vmware-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });

// Generate typed tools from command definitions
const typedTools = generateMCPTools();

// O(1) lookup map for typed tools (#8)
const toolMap = new Map(typedTools.map((t) => [t.name, t]));

// ---------------------------------------------------------------------------
// Built-in meta tools
// ---------------------------------------------------------------------------

const SEARCH_TOOL = {
  name: 'govc_search',
  description:
    'Search through all ~300 available govc commands. Returns matching commands with descriptions. Use this to discover what govc can do before running commands.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      query: {
        type: 'string',
        description: 'Search query (e.g. "vm power", "datastore", "snapshot", "cluster drs")',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results (default: 15)',
      },
    },
    required: ['query'],
  },
};

const HELP_TOOL = {
  name: 'govc_help',
  description:
    'Get detailed help for a specific govc command including all flags, usage examples, and descriptions. Runs `govc <command> -h`.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      command: {
        type: 'string',
        description: 'The govc command to get help for (e.g. "vm.info", "cluster.add", "snapshot.create")',
      },
    },
    required: ['command'],
  },
};

const RUN_TOOL = {
  name: 'govc_run',
  description:
    "Run any govc command directly. This is the escape hatch for commands that don't have a dedicated typed tool. Use govc_search or govc_help to discover commands first.",
  inputSchema: {
    type: 'object' as const,
    properties: {
      command: {
        type: 'string',
        description: 'The govc sub-command (e.g. "vm.info", "host.esxcli", "find")',
      },
      flags: {
        type: 'object',
        description: 'Flag key-value pairs without leading dashes. Example: {"vm": "my-vm", "r": true}',
        additionalProperties: true,
      },
      args: {
        type: 'string',
        description: 'Positional arguments as a space-separated string. Supports quoting.',
      },
      json: {
        type: 'boolean',
        description: "Request JSON output (default: true). Set false for commands that don't support it.",
      },
    },
    required: ['command'],
  },
};

// ---------------------------------------------------------------------------
// ListTools handler
// ---------------------------------------------------------------------------

server.setRequestHandler(ListToolsRequestSchema, async (request) => {
  const { cursor } = request.params || {};
  const pageSize = 400;

  const allTools = [
    SEARCH_TOOL,
    HELP_TOOL,
    RUN_TOOL,
    ...typedTools.map(({ name, description, inputSchema }) => ({
      name,
      description,
      inputSchema,
    })),
  ];

  const startIndex = cursor ? parseInt(cursor, 10) : 0;
  const endIndex = Math.min(startIndex + pageSize, allTools.length);
  const paginatedTools = allTools.slice(startIndex, endIndex);
  const nextCursor = endIndex < allTools.length ? endIndex.toString() : undefined;

  return {
    tools: paginatedTools,
    ...(nextCursor && { nextCursor }),
  };
});

// ---------------------------------------------------------------------------
// CallTool handler
// ---------------------------------------------------------------------------

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  // -- govc_search --
  if (name === 'govc_search') {
    const { query, limit = 15 } = args as { query: string; limit?: number };
    const results = searchCommands(query, limit);
    return {
      content: [
        {
          type: 'text',
          text: formatForLLM({ query, results }),
        },
      ],
    };
  }

  // -- govc_help --
  if (name === 'govc_help') {
    const { command } = args as { command: string };
    const helpText = await execGovcHelp(command);
    return {
      content: [{ type: 'text', text: helpText }],
    };
  }

  // -- govc_run (generic escape hatch) --
  if (name === 'govc_run') {
    const {
      command,
      flags = {},
      args: positionalStr = '',
      json = true,
    } = args as {
      command: string;
      flags?: Record<string, unknown>;
      args?: string;
      json?: boolean;
    };

    // Strip leading dashes from flag keys defensively (#10)
    const cleanFlags: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(flags)) {
      cleanFlags[key.replace(/^-+/, '')] = val;
    }

    const positional = positionalStr ? splitArgs(positionalStr) : [];
    const result = await execGovc(command, cleanFlags, positional, json);
    return {
      content: [{ type: 'text', text: formatForLLM(result) }],
    };
  }

  // -- Typed tools (O(1) Map lookup) --
  const tool = toolMap.get(name);
  if (tool) {
    const result = await tool.handler(args as Record<string, unknown>);
    return {
      content: [{ type: 'text', text: formatForLLM(result) }],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`VMWare MCP server running on stdio (${typedTools.length} typed tools + 3 meta tools)`);
  startHttpServer();

  // The MCP SDK's StdioServerTransport does not handle stdin EOF,
  // so we listen directly. Without this the health-check server
  // keeps the event loop alive and the container never exits.
  process.stdin.on('end', () => {
    console.error('stdin closed, shutting down…');
    process.exit(0);
  });
}

main().catch(console.error);
