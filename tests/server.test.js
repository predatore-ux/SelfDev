import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "../server.mjs";

let server, origin;
before(async () => {
  server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test("serves the app and each ES module with the correct MIME type", async () => {
  for (const file of [
    "",
    "app.js",
    "content.js",
    "state.js",
    "style.css",
    "accessibility.css",
    "icon.svg",
  ]) {
    const response = await fetch(`${origin}/${file}`);
    assert.equal(response.status, 200, file);
    assert.ok(
      response.headers
        .get("content-type")
        .includes(
          file.endsWith(".js")
            ? "javascript"
            : file.endsWith(".css")
              ? "css"
              : file.endsWith(".svg")
                ? "svg"
                : "html",
        ),
    );
    assert.ok((await response.text()).length > 0);
  }
});

test("HEAD returns headers without a response body", async () => {
  const response = await fetch(origin, { method: "HEAD" });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "");
});

test("does not expose source configuration, credentials or arbitrary files", async () => {
  for (const file of [
    ".git/config",
    ".env",
    "private/hosting.json",
    "server.mjs",
    "package.json",
    "missing",
    "%2e%2e%2fserver.mjs",
  ]) {
    assert.equal((await fetch(`${origin}/${file}`)).status, 404, file);
  }
});

test("rejects writes and malformed URLs", async () => {
  assert.equal(
    (await fetch(origin, { method: "POST", body: "test" })).status,
    405,
  );
  assert.equal((await fetch(`${origin}/%zz`)).status, 400);
});

test("applies security headers without external script or connection origins", async () => {
  const response = await fetch(origin);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  assert.ok(
    response.headers
      .get("content-security-policy")
      .includes("connect-src 'self'"),
  );
});
