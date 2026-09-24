import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { ApplyProxyError, submitApplication } from './applyProxy';

const applyApi = {
  name: 'apply-api',
  configureServer(server: { middlewares: { use: (path: string, handler: (request: any, response: any) => void) => void } }) {
    server.middlewares.use('/api/apply', async (request, response) => {
      if (request.method !== 'POST') {
        response.statusCode = 405;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify({ error: 'Method not allowed.' }));
        return;
      }

      let body = '';
      request.on('data', (chunk: Buffer) => {
        body += chunk.toString();
      });
      request.on('end', async () => {
        try {
          const result = await submitApplication(JSON.parse(body));
          response.statusCode = 200;
          response.setHeader('Content-Type', 'application/json');
          response.end(JSON.stringify(result));
        } catch (error) {
          response.statusCode = error instanceof ApplyProxyError ? error.status : 502;
          response.setHeader('Content-Type', 'application/json');
          response.end(JSON.stringify({
            error: error instanceof Error ? error.message : 'Unable to send your application.',
          }));
        }
      });
    });
  },
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [applyApi, react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: true,
      allowedHosts: true,
      hmr: false,
    },
    build: {
      sourcemap: false,
    },
  };
});
