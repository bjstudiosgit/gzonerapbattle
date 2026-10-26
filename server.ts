import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import { ApplyProxyError, submitApplication } from "./applyProxy";
import { MAX_APPLICATION_BYTES } from "./src/lib/applicationPayload";
import { applyRateLimiter, clientIp, isAllowedOrigin } from "./src/lib/applyGuard";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.set("trust proxy", 1);
  app.use(express.json({ limit: MAX_APPLICATION_BYTES }));

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Vite dev middleware and third-party media need a tuned policy
      crossOriginEmbedderPolicy: false,
    })
  );

  // API routes can be added here
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/apply", async (req, res) => {
    res.setHeader("Cache-Control", "no-store");

    if (!isAllowedOrigin(req.headers.origin, req.headers.host)) {
      res.status(403).json({ error: "Origin not allowed." });
      return;
    }

    const rateLimit = applyRateLimiter(`apply:${clientIp(req.headers, req.socket.remoteAddress)}`);
    if (!rateLimit.allowed) {
      res.setHeader("Retry-After", String(rateLimit.retryAfterSeconds));
      res.status(429).json({ error: "Too many applications. Please try again later." });
      return;
    }

    try {
      res.json(await submitApplication(req.body));
    } catch (error) {
      const status = error instanceof ApplyProxyError ? error.status : 502;
      res.status(status).json({
        error:
          error instanceof ApplyProxyError
            ? error.message
            : "Unable to send your application.",
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.use(
    (
      error: Error & { type?: string; status?: number },
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (res.headersSent) {
        next(error);
        return;
      }
      if (error.type === "entity.too.large") {
        res.status(413).json({ error: "Application payload is too large." });
        return;
      }
      if (error instanceof SyntaxError) {
        res.status(400).json({ error: "Invalid JSON payload." });
        return;
      }
      next(error);
    }
  );

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
