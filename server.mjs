import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const publicFiles = new Set([
  "index.html",
  "app.js",
  "content.js",
  "state.js",
  "style.css",
  "accessibility.css",
  "icon.svg",
]);
const types = {
  html: "text/html; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  css: "text/css; charset=utf-8",
  svg: "image/svg+xml",
};
export const securityHeaders = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'self'; object-src 'none'; frame-ancestors 'none'",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export function createServer() {
  return http.createServer(async (request, response) => {
    const headers = { ...securityHeaders, "Cache-Control": "no-cache" };
    if (!["GET", "HEAD"].includes(request.method)) {
      response.writeHead(405, { ...headers, Allow: "GET, HEAD" });
      response.end("Method not allowed");
      return;
    }
    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      );
    } catch {
      response.writeHead(400, headers);
      response.end("Bad request");
      return;
    }
    const file = pathname === "/" ? "index.html" : pathname.slice(1);
    if (!publicFiles.has(file)) {
      response.writeHead(404, headers);
      response.end("Not found");
      return;
    }
    try {
      const content = await readFile(
        new URL("./dist/" + file, import.meta.url),
      );
      response.writeHead(200, {
        ...headers,
        "Content-Type": types[file.split(".").pop()],
      });
      response.end(request.method === "HEAD" ? undefined : content);
    } catch {
      response.writeHead(500, headers);
      response.end("Unable to read page");
    }
  });
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const port = Number(process.env.PORT || 4173);
  const host = process.env.HOST || "127.0.0.1";
  const server = createServer();
  server.on("error", (error) => {
    console.error(`Unable to start SELFDEV: ${error.message}`);
    process.exitCode = 1;
  });
  server.listen(port, host, () =>
    console.log(`SELFDEV: http://${host}:${port}`),
  );
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.once(signal, () => server.close(() => process.exit(0)));
  }
}
