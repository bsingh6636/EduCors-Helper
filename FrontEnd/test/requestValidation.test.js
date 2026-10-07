import { test } from "node:test";
import assert from "node:assert/strict";
import {
  PRESETS,
  isDemoRequest,
  parseHeaders,
  validateRequest,
} from "../src/lib/api.js";

const request = (overrides = {}) =>
  validateRequest({
    target: PRESETS[0].url,
    method: "GET",
    headerText: "{}",
    ...overrides,
  });
const rejectsField = (overrides, field, message) =>
  assert.throws(
    () => request(overrides),
    (error) => error.field === field && message.test(error.message),
  );

test("all four exact demo methods and URLs allow an empty key", () => {
  for (const preset of PRESETS) {
    const result = request({ target: preset.url, method: preset.method });
    assert.equal(result.headers["x-api-key"], undefined);
    assert.equal(isDemoRequest(preset.url, preset.method), true);
  }
});
test("editing the URL, query, or method requires a key", () => {
  for (const overrides of [
    { target: "https://example.com/data" },
    { target: PRESETS[0].url + "?extra=1" },
    { method: "DELETE" },
    { method: "HEAD" },
    { key: "   ", target: "https://example.com/data" },
  ])
    rejectsField(overrides, "key", /API key is required/);
});
test("empty and malformed URLs are rejected before a key is checked", () => {
  for (const target of ["", "   ", "api.example.com", "https://"])
    rejectsField({ target }, "target", /URL/);
});
test("unsupported protocols, credentials, ports, and oversized URLs are rejected", () => {
  for (const target of [
    "ftp://example.com/data",
    "https://user:password@example.com/data",
    "https://example.com:8080/data",
    "https://example.com/" + "x".repeat(4096),
  ])
    rejectsField({ target }, "target", /URL|ports|characters/);
});
test("surrounding URL whitespace and fragments use the same demo rules as the API", () => {
  const target = "  " + PRESETS[0].url + "#section  ";
  assert.equal(isDemoRequest(target, "GET"), true);
  assert.equal(request({ target }).url.href, PRESETS[0].url);
});
test("custom requests accept a key without claiming it is server-verified", () => {
  assert.equal(
    request({ target: "https://example.com/", key: " legacy-valid-key " })
      .headers["x-api-key"],
    "legacy-valid-key",
  );
});
test("custom requests accept a case-insensitive key header", () => {
  assert.equal(
    request({
      target: "https://example.com/",
      headerText: '{"X-API-Key":"header-key"}',
    }).headers["x-api-key"],
    "header-key",
  );
});
test("a bearer token is for the target API and does not count as an EduCors key", () => {
  rejectsField(
    {
      target: "https://example.com/",
      headerText: '{"Authorization":"Bearer upstream-token"}',
    },
    "key",
    /API key is required/,
  );
});
test("the key field overrides a key header while retaining upstream Authorization", () => {
  const result = request({
    key: "field-key",
    headerText:
      '{"X-API-Key":"header-key","Authorization":"Bearer upstream-token"}',
  });
  assert.deepEqual(result.headers, {
    authorization: "Bearer upstream-token",
    "x-api-key": "field-key",
  });
});
test("malformed keys are rejected even for demos", () => {
  for (const key of ["has spaces", "x".repeat(257)])
    rejectsField({ key }, "key", /valid API key/);
  rejectsField(
    { headerText: '{"x-api-key":"has spaces"}' },
    "headers",
    /valid API key/,
  );
});
test("optional headers may be empty and header names are normalized", () => {
  assert.deepEqual(parseHeaders("  "), {});
  assert.deepEqual(parseHeaders('{"Accept":"application/json"}'), {
    accept: "application/json",
  });
});
test("invalid header JSON, shape, names, and values are rejected", () => {
  for (const headerText of [
    "{broken",
    "null",
    "[]",
    '"text"',
    '{"Accept":true}',
    '{"": "value"}',
    '{"Bad Name":"value"}',
    JSON.stringify({ Accept: "application/json\r\ninjected: value" }),
  ])
    rejectsField({ headerText }, "headers", /header|Header|JSON/);
});
test("JSON and vendor JSON bodies are checked regardless of content-type casing", () => {
  for (const contentType of [
    "application/json",
    "Application/JSON; charset=utf-8",
    "application/problem+json",
  ])
    rejectsField(
      {
        method: "POST",
        target: PRESETS[1].url,
        body: "{broken",
        headerText: JSON.stringify({ "Content-Type": contentType }),
      },
      "body",
      /JSON syntax/,
    );
  assert.doesNotThrow(() =>
    request({
      method: "POST",
      target: PRESETS[1].url,
      body: '{"valid":true}',
      headerText: '{"Content-Type":"application/json"}',
    }),
  );
});
test("empty and non-JSON bodies are permitted and GET/HEAD do not send bodies", () => {
  assert.doesNotThrow(() =>
    request({
      method: "POST",
      target: PRESETS[1].url,
      headerText: '{"Content-Type":"application/json"}',
    }),
  );
  assert.doesNotThrow(() =>
    request({ method: "POST", target: PRESETS[1].url, body: "plain text" }),
  );
  assert.doesNotThrow(() =>
    request({
      body: "{broken",
      headerText: '{"Content-Type":"application/json"}',
    }),
  );
});
test("body limits count UTF-8 bytes rather than characters", () => {
  rejectsField(
    { method: "POST", target: PRESETS[1].url, body: "é".repeat(524289) },
    "body",
    /1 MB/,
  );
  assert.doesNotThrow(() =>
    request({
      method: "POST",
      target: PRESETS[1].url,
      body: "é".repeat(524288),
    }),
  );
});
test("unsupported HTTP methods are rejected", () => {
  rejectsField({ method: "TRACE" }, "method", /supported HTTP method/);
});
