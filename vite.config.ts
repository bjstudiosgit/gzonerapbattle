import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { ApplyProxyError, submitApplication } from './applyProxy';
import { MAX_APPLICATION_BYTES } from './src/lib/applicationPayload';
import { applyRateLimiter, clientIp, isAllowedOrigin, isJsonContentType } from './src/lib/applyGuard';

type ViteRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
  on: (event: 'data' | 'end', handler: (chunk?: Buffer) => void) => void;
};

type ViteResponse = {
  statusCode: number;
  setHeader: (name: string, value: string | number) => void;
  end: (body?: string) => void;
};

const applyApi = {
  name: 'apply-api',
  configureServer(server: { middlewares: { use: (path: string, handler: (request: ViteRequest, response: ViteResponse) => void) => void } }) {
    server.middlewares.use('/api/apply', async (request, response) => {
      const sendJson = (status: number, payload: unknown) => {
        response.statusCode = status;
        response.setHeader('Content-Type', 'application/json');
        response.setHeader('Cache-Control', 'no-store');
        response.end(JSON.stringify(payload));
      };

      if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST');
        sendJson(405, { error: 'Method not allowed.' });
        return;
      }

      if (!isJsonContentType(request.headers['content-type'] as string | undefined)) {
        sendJson(415, { error: 'Unsupported content type.' });
        return;
      }

      const declaredLength = Number(request.headers['content-length'] ?? 0);
      if (Number.isFinite(declaredLength) && declaredLength > MAX_APPLICATION_BYTES) {
        sendJson(413, { error: 'Application payload is too large.' });
        return;
      }

      if (!isAllowedOrigin(
        request.headers.origin as string | undefined,
        request.headers.host as string | undefined
      )) {
        sendJson(403, { error: 'Origin not allowed.' });
        return;
      }

      const rateLimit = applyRateLimiter(`apply:${clientIp(request.headers, request.socket?.remoteAddress)}`);
      if (!rateLimit.allowed) {
        response.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
        sendJson(429, { error: 'Too many applications. Please try again later.' });
        return;
      }

      let body = '';
      let tooLarge = false;

      request.on('data', (chunk) => {
        if (tooLarge || !chunk) return;
        body += chunk.toString();
        if (Buffer.byteLength(body, 'utf8') > MAX_APPLICATION_BYTES) {
          tooLarge = true;
          body = '';
        }
      });

      request.on('end', async () => {
        if (tooLarge) {
          sendJson(413, { error: 'Application payload is too large.' });
          return;
        }

        try {
          const result = await submitApplication(JSON.parse(body));
          sendJson(200, result);
        } catch (error) {
          if (error instanceof SyntaxError) {
            sendJson(400, { error: 'Invalid JSON payload.' });
            return;
          }
          sendJson(
            error instanceof ApplyProxyError ? error.status : 502,
            {
              error:
                error instanceof ApplyProxyError
                  ? error.message
                  : 'Unable to send your application.',
            }
          );
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
      chunkSizeWarningLimit: 750,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return undefined;
            const normalized = id.replace(/\\/g, '/');
            if (normalized.includes('/firebase/') || normalized.includes('@firebase')) return 'firebase';
            if (normalized.includes('@supabase')) return 'supabase';
            if (normalized.includes('/motion/') || normalized.includes('framer-motion')) return 'motion';
            if (normalized.includes('/react/') || normalized.includes('/react-dom/') || normalized.includes('/react-router')) {
              return 'react-vendor';
            }
            if (normalized.includes('lucide-react')) return 'icons';
            return undefined;
          },
        },
      },
    },
  };
});
