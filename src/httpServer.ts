import http from 'node:http';

const server = http.createServer((_, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});

export const startHttpServer = (port = 3211) => {
  server.listen(port, () => {
    console.error(`Http keepalive server running on port ${port}`);
  });
};
