import express from 'express';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();

  // Serve static stylesheet, script, root assets (GitHub Pages compatible), and public directories
  app.use('/css', express.static(path.join(__dirname, 'css')));
  app.use('/js', express.static(path.join(__dirname, 'js')));
  app.use('/assets', express.static(path.join(__dirname, 'assets')));
  app.use(express.static(path.join(__dirname, 'public')));

  // Serve root index.html for the home route and direct /index.html requests
  app.get(['/', '/index.html'], (_req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  // Return 404 for missing static assets or unknown paths instead of exposing source/config files
  app.use((_req, res) => {
    res.status(404).send('Not Found');
  });

  return app;
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectRun) {
  const PORT = Number(process.env.PORT) || 3000;
  const HOST = '0.0.0.0';
  const app = createApp();

  app.listen(PORT, HOST, () => {
    console.log(`ANHAD '26 server listening at http://${HOST}:${PORT}`);
  });
}
