import { createServer } from "node:http";
import { stat, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_DIR = path.resolve(__dirname, "..", "..", "out");
const PORT = Number.parseInt(process.env.PORT ?? "3000", 10);
const HOST = process.env.HOST ?? "0.0.0.0";

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".xml", "application/xml; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".gif", "image/gif"],
  [".ico", "image/x-icon"],
  [".map", "application/json; charset=utf-8"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
  [".ttf", "font/ttf"],
  [".eot", "application/vnd.ms-fontobject"],
]);

function safeResolve(requestPath) {
  const decoded = decodeURIComponent(requestPath);
  const withoutQuery = decoded.split("?")[0] ?? "/";
  const sanitized = withoutQuery.replaceAll("\\", "/");
  const joined = path.join(OUT_DIR, sanitized);
  const resolved = path.resolve(joined);

  if (!resolved.startsWith(OUT_DIR)) return null;
  return resolved;
}

async function fileExists(filePath) {
  try {
    const info = await stat(filePath);
    return info.isFile();
  } catch {
    return false;
  }
}

async function dirExists(dirPath) {
  try {
    const info = await stat(dirPath);
    return info.isDirectory();
  } catch {
    return false;
  }
}

function setHeaders(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  res.setHeader("Content-Type", contentTypes.get(ext) ?? "application/octet-stream");

  if (filePath.includes(`${path.sep}_next${path.sep}`)) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return;
  }

  res.setHeader("Cache-Control", "no-cache");
}

const server = createServer(async (req, res) => {
  if (!req.url) {
    res.statusCode = 400;
    res.end("Bad Request");
    return;
  }

  const resolvedPath = safeResolve(req.url);
  if (!resolvedPath) {
    res.statusCode = 400;
    res.end("Bad Request");
    return;
  }

  let filePath = resolvedPath;

  if (await dirExists(filePath)) {
    const indexPath = path.join(filePath, "index.html");
    const htmlPath = `${filePath}.html`;

    filePath = (await fileExists(indexPath))
      ? indexPath
      : (await fileExists(htmlPath))
        ? htmlPath
        : indexPath;
  } else if (filePath.endsWith(path.sep) || req.url.endsWith("/")) {
    const htmlPath = `${filePath}.html`;
    filePath = (await fileExists(htmlPath)) ? htmlPath : path.join(filePath, "index.html");
  } else if (!(await fileExists(filePath))) {
    const tryHtml = `${filePath}.html`;
    const tryDir = filePath;

    if (await fileExists(tryHtml)) {
      filePath = tryHtml;
    } else if (await dirExists(tryDir)) {
      filePath = path.join(tryDir, "index.html");
    } else if (await fileExists(path.join(tryDir, "index.html"))) {
      filePath = path.join(tryDir, "index.html");
    }
  }

  if (!(await fileExists(filePath))) {
    const notFound = path.join(OUT_DIR, "404.html");
    if (await fileExists(notFound)) {
      res.statusCode = 404;
      setHeaders(res, notFound);
      res.end(await readFile(notFound));
      return;
    }

    res.statusCode = 404;
    res.end("Not Found");
    return;
  }

  try {
    res.statusCode = 200;
    setHeaders(res, filePath);
    res.end(await readFile(filePath));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
});

server.listen(PORT, HOST, async () => {
  // eslint-disable-next-line no-console
  console.log(`Serving static export from ${OUT_DIR}`);
  // eslint-disable-next-line no-console
  console.log(`http://localhost:${PORT}`);
});
