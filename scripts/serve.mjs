// Tiny static file server for local development: node scripts/serve.mjs [port]. No dependencies.
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.argv[2] || process.env.PORT || 8080);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".xml": "application/xml", ".md": "text/markdown; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".ico": "image/x-icon", ".mp4": "video/mp4", ".txt": "text/plain; charset=utf-8",
};

// Maps a request path to a file inside the site folder; folders serve their index.html.
async function resolveFile(urlPath) {
  const file = join(ROOT, normalize(decodeURIComponent(urlPath)));
  if (!file.startsWith(ROOT)) return null;
  const info = await stat(file).catch(() => null);
  if (info?.isDirectory()) return join(file, "index.html");
  return info ? file : null;
}

// Answers one request with the file's bytes, or a 404.
async function handle(req, res) {
  const file = await resolveFile(new URL(req.url, "http://x").pathname).catch(() => null);
  const ok = file && (await stat(file).catch(() => null));
  res.writeHead(ok ? 200 : 404, { "Content-Type": ok ? TYPES[extname(file)] ?? "application/octet-stream" : "text/plain", "Cache-Control": "no-cache" });
  if (ok) createReadStream(file).pipe(res);
  else res.end("Not found");
}

createServer(handle).listen(PORT, "127.0.0.1", () => console.log(`http://localhost:${PORT}/`));
