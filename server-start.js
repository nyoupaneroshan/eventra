// Custom server wrapper to keep Next.js alive
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';
const dev = process.env.NODE_ENV !== 'production';

process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('[FATAL] Unhandled Rejection:', err);
});

async function main() {
  const app = next({ dev, hostname, port });
  const handle = app.getRequestHandler();
  
  await app.prepare();
  
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });
  
  server.on('error', (err) => {
    console.error('[SERVER ERROR]', err);
  });
  
  server.listen(port, hostname, () => {
    console.log(`> Server listening at http://${hostname}:${port} as ${dev ? 'development' : 'production'}`);
  });
}

main().catch((err) => {
  console.error('[STARTUP ERROR]', err);
  process.exit(1);
});
