import http from 'node:http';

/**
 * HTTP health-check endpoint for container orchestrators (Docker, K8s).
 *
 * Responds with `200 ok` on every request — used as a liveness probe.
 * The port defaults to 3211 and can be overridden via the `HTTP_PORT` env var.
 */

const server = http.createServer((_, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});

export const startHttpServer = (port = parseInt(process.env.HTTP_PORT || '3211', 10)) => {
  server.listen(port, () => {
    console.error(`Http health-check server running on port ${port}`);
  });

  server.on('error', (err) => {
    console.error(`✗ Health-check server failed to start: ${err.message}`);
  });
};
