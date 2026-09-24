import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import { ApplyProxyError, submitApplication } from "./applyProxy";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json());

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disable CSP for development to allow Vite HMR and external assets
      crossOriginEmbedderPolicy: false,
    })
  );

  // API routes can be added here
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/apply", async (req, res) => {
    try {
      res.json(await submitApplication(req.body));
    } catch (error) {
      res.status(error instanceof ApplyProxyError ? error.status : 502).json({
        error: error instanceof Error ? error.message : "Unable to send your application.",
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
