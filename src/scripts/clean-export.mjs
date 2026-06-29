import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_DIR = path.resolve(__dirname, "..", "..", "out");

const targets = [
  path.join(OUT_DIR, "404"),
  path.join(OUT_DIR, "404.html"),
  path.join(OUT_DIR, "_not-found"),
  path.join(OUT_DIR, "__next.__PAGE__.txt"),
  path.join(OUT_DIR, "__next._full.txt"),
  path.join(OUT_DIR, "__next._head.txt"),
  path.join(OUT_DIR, "__next._index.txt"),
  path.join(OUT_DIR, "__next._tree.txt"),
  path.join(OUT_DIR, "index.txt"),
];

await Promise.all(
  targets.map(async (target) => {
    try {
      await rm(target, { recursive: true, force: true });
    } catch {
      // ignore
    }
  }),
);
