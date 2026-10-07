import { test } from "node:test";
import assert from "node:assert/strict";
import { generateCode, proxyUrl, publicProxyUrl } from "../src/lib/api.js";

const endpoint = "https://cors-proxy.brijeshhq.com/api/getData";
const target =
  "https://api.example.com/data?filter=first&next=https%3A%2F%2Fexample.com";
function fromLocalPage(check) {
  const previous = globalThis.window;
  globalThis.window = { location: { origin: "http://127.0.0.1:5174" } };
  try {
    check();
  } finally {
    if (previous === undefined) delete globalThis.window;
    else globalThis.window = previous;
  }
}

test("public proxy URLs preserve complete target query strings", () => {
  const url = new URL(publicProxyUrl(target));
  assert.equal(url.origin + url.pathname, endpoint);
  assert.equal(url.searchParams.get("Target"), target);
  assert.deepEqual([...url.searchParams.keys()], ["Target"]);
});
test("all five integration formats use the public domain even on a local page", () => {
  fromLocalPage(() => {
    for (const language of ["fetch", "curl", "python", "axios", "go"]) {
      const code = generateCode({
        target,
        language,
        method: "POST",
        key: "example-key",
        headers: { "Content-Type": "application/json" },
        body: '{"message":"hello"}',
      });
      assert.ok(
        code.includes(endpoint),
        language + " must use the public endpoint",
      );
      assert.ok(code.includes("x-api-key"));
      assert.doesNotMatch(code, /localhost|127\.0\.0\.1/);
      const url = new URL(publicProxyUrl(target));
      assert.equal(url.searchParams.has("ApiKey"), false);
      assert.equal(url.searchParams.has("x-api-key"), false);
    }
  });
});
test("interactive local requests continue to use the local API", () => {
  fromLocalPage(() => {
    const url = new URL(proxyUrl(target));
    assert.equal(url.origin, "http://127.0.0.1:5174");
    assert.equal(url.pathname, "/api/getData");
    assert.equal(url.searchParams.get("Target"), target);
  });
});
