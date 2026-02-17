echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}
{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"ls","arguments":{}}}' \
| docker run --rm -i --env-file .env.docker -e GOVC_URL=https://host.docker.internal:8443/sdk vmware-mcp
