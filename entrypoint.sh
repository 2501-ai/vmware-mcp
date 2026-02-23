#!/bin/sh
set -e

if [ "$MCP_KEEP_ALIVE" = "true" ] || [ "$MCP_KEEP_ALIVE" = "1" ]; then
  printf '✓ vmware-mcp container ready (persistent mode)\n' >&2
  printf '  Connect with: docker exec -i vmware-mcp vmware-mcp\n' >&2
  exec tail -f /dev/null
else
  exec vmware-mcp
fi