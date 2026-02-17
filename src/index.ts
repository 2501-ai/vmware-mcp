import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { execGovc } from './govc';

// WHY: Using low-level Server API for direct request handler control
// eslint-disable-next-line @typescript-eslint/no-deprecated
const server = new Server({ name: 'mcp-govc', version: '1.0.0' }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, () => {
  return {
    tools: [
      {
        name: 'govc',
        description:
          'Execute any govc subcommand against a vSphere environment. ' +
          'Pass the subcommand and its arguments as separate strings. ' +
          'Example: subcommand "vm.info", args ["/DC/vm/myvm"].',
        inputSchema: {
          type: 'object' as const,
          properties: {
            subcommand: {
              type: 'string',
              description: 'The govc subcommand to run (e.g. "about", "vm.info", "ls").',
            },
            args: {
              type: 'array',
              items: { type: 'string' },
              description: 'Optional arguments for the subcommand.',
            },
          },
          required: ['subcommand'],
        },
      },
      {
        name: 'govc_commands',
        description:
          'List all available govc subcommands. ' +
          'Use this to discover what operations are available before calling govc.',
        inputSchema: {
          type: 'object' as const,
          properties: {},
        },
      },
      {
        name: 'govc_help',
        description: 'Get detailed help for a specific govc subcommand, including available flags and usage.',
        inputSchema: {
          type: 'object' as const,
          properties: {
            subcommand: {
              type: 'string',
              description: 'The govc subcommand to get help for (e.g. "vm.info").',
            },
          },
          required: ['subcommand'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'govc': {
      const subcommand = args?.subcommand as string;
      if (!subcommand) {
        return { content: [{ type: 'text', text: 'Error: subcommand is required.' }] };
      }
      const cmdArgs = (args?.args as string[]) ?? [];
      const result = await execGovc([subcommand, ...cmdArgs]);

      let text = '';
      if (result.stdout) text += result.stdout;
      if (result.stderr) text += (text ? '\n' : '') + result.stderr;
      if (!text) text = `Command completed with exit code ${String(result.exitCode)}.`;
      if (result.exitCode !== 0 && !result.stderr) {
        text += `\nExit code: ${String(result.exitCode)}`;
      }

      return { content: [{ type: 'text', text }] };
    }

    case 'govc_commands': {
      const result = await execGovc(['-h']);
      // govc -h prints help to stderr
      const output = result.stderr || result.stdout;

      // Parse the command list from help output
      const lines = output.split('\n');
      const commands: string[] = [];
      let inCommands = false;
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed === 'Available commands:' || trimmed.startsWith('Commands:')) {
          inCommands = true;
          continue;
        }
        if (inCommands) {
          if (trimmed === '' || trimmed.startsWith('Use ') || trimmed.startsWith('Flags:')) {
            break;
          }
          if (trimmed) {
            commands.push(trimmed);
          }
        }
      }

      const text = commands.length > 0 ? commands.join('\n') : output; // Fallback: return raw help output

      return { content: [{ type: 'text', text }] };
    }

    case 'govc_help': {
      const subcommand = args?.subcommand as string;
      if (!subcommand) {
        return { content: [{ type: 'text', text: 'Error: subcommand is required.' }] };
      }
      const result = await execGovc([subcommand, '-h']);
      const text = result.stderr || result.stdout || `No help available for "${subcommand}".`;
      return { content: [{ type: 'text', text }] };
    }

    default:
      return { content: [{ type: 'text', text: `Unknown tool: ${name}` }] };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('mcp-govc server started on stdio');
}

main().catch((err: unknown) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
