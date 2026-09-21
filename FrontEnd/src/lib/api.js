export const API_BASE = (import.meta.env?.VITE_API_URL || "/api").replace(
  /\/$/,
  "",
);
export const PUBLIC_API_BASE = "https://cors-proxy.brijeshhq.com/api";
export const PUBLIC_PROXY_ENDPOINT = PUBLIC_API_BASE + "/getData";
export const GITHUB = "https://github.com/bsingh6636/EduCors-Helper";
export const PRESETS = [
  {
    id: "post",
    title: "A sample post",
    description: "Read a JSON resource",
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    body: "",
  },
  {
    id: "create",
    title: "Create a post",
    description: "Send a JSON request body",
    method: "POST",
    url: "https://jsonplaceholder.typicode.com/posts",
    body: JSON.stringify(
      { title: "Hello from EduCors", body: "Back to building.", userId: 1 },
      null,
      2,
    ),
  },
  {
    id: "github",
    title: "GitHub profile",
    description: "Meet the Octocat",
    method: "GET",
    url: "https://api.github.com/users/octocat",
    body: "",
  },
  {
    id: "dog",
    title: "A very good dog",
    description: "Fetch a random image URL",
    method: "GET",
    url: "https://dog.ceo/api/breeds/image/random",
    body: "",
  },
];
export async function api(path, options = {}) {
  let response;
  try {
    response = await fetch(API_BASE + path, {
      credentials: "include",
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error(
      "Could not reach EduCors. Check your connection and try again.",
    );
  }
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) {
    const error = new Error(
      data?.message || "The API is unavailable. Please try again.",
    );
    error.status = response.status;
    throw error;
  }
  return data;
}
export function proxyUrl(target) {
  const url = new URL(API_BASE + "/getData", window.location.origin);
  url.searchParams.set("Target", target);
  return url.href;
}
export function publicProxyUrl(target) {
  const url = new URL(PUBLIC_PROXY_ENDPOINT);
  url.searchParams.set("Target", target);
  return url.href;
}
export const pretty = (value) =>
  typeof value === "string" ? value : JSON.stringify(value, null, 2);
function invalidRequest(message, field) {
  return Object.assign(new Error(message), { field });
}
export function validateTarget(target) {
  if (!target.trim())
    throw invalidRequest("Enter a target URL before sending.", "target");
  if (target.length > 4096)
    throw invalidRequest(
      "The target URL must be 4,096 characters or fewer.",
      "target",
    );
  let url;
  try {
    url = new URL(target.trim());
  } catch {
    throw invalidRequest(
      "Enter a complete URL starting with http:// or https://.",
      "target",
    );
  }
  if (!["http:", "https:"].includes(url.protocol))
    throw invalidRequest(
      "Use a URL starting with http:// or https://.",
      "target",
    );
  if (url.username || url.password)
    throw invalidRequest(
      "Use an Authorization header instead of credentials in the URL.",
      "target",
    );
  if (url.port && !["80", "443"].includes(url.port))
    throw invalidRequest(
      "Only standard HTTP and HTTPS ports (80 and 443) are supported.",
      "target",
    );
  url.hash = "";
  return url;
}
export function isDemoRequest(target, method) {
  try {
    const url = validateTarget(target);
    return PRESETS.some(
      (preset) => preset.url === url.href && preset.method === method,
    );
  } catch {
    return false;
  }
}
export function parseHeaders(text) {
  let parsed;
  try {
    parsed = text.trim() ? JSON.parse(text) : {};
  } catch {
    throw invalidRequest("Check the JSON syntax in your headers.", "headers");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
    throw invalidRequest("Headers must be a JSON object.", "headers");
  if (
    Object.entries(parsed).some(
      ([key, value]) => !key.trim() || typeof value !== "string",
    )
  )
    throw invalidRequest("Header names and values must be strings.", "headers");
  for (const [name, value] of Object.entries(parsed)) {
    try {
      new Headers([[name, value]]);
    } catch {
      throw invalidRequest(
        "A header has an invalid name or value. Remove spaces from names and line breaks from values.",
        "headers",
      );
    }
  }
  return Object.fromEntries(new Headers(parsed).entries());
}
export function headerApiKey(headers) {
  return headers["x-api-key"]?.trim() || "";
}
export function validateRequest({
  target,
  method,
  headerText,
  body = "",
  key = "",
}) {
  const url = validateTarget(target);
  if (!["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"].includes(method))
    throw invalidRequest("Choose a supported HTTP method.", "method");
  const headers = parseHeaders(headerText);
  const suppliedKey = key.trim() || headerApiKey(headers);
  if (!suppliedKey && !isDemoRequest(url.href, method))
    throw invalidRequest(
      "An API key is required for this URL and method. Add your EduCors key or choose a demo preset.",
      "key",
    );
  if (suppliedKey && (suppliedKey.length > 256 || /\s/.test(suppliedKey)))
    throw invalidRequest(
      "Enter a valid API key with no spaces, using 256 characters or fewer.",
      key.trim() ? "key" : "headers",
    );
  if (!["GET", "HEAD"].includes(method) && body) {
    if (new TextEncoder().encode(body).byteLength > 1024 * 1024)
      throw invalidRequest("The request body must be 1 MB or smaller.", "body");
    const type = (headers["content-type"] || "")
      .split(";")[0]
      .trim()
      .toLowerCase();
    if (type === "application/json" || type.endsWith("+json")) {
      try {
        JSON.parse(body);
      } catch {
        throw invalidRequest(
          "Check the JSON syntax in your request body.",
          "body",
        );
      }
    }
  }
  if (key.trim()) headers["x-api-key"] = key.trim();
  return { url, headers };
}
export function generateCode({
  target,
  method = "GET",
  headers = {},
  body = "",
  key = "",
  language = "fetch",
}) {
  const url = publicProxyUrl(target);
  const forwarded = { ...headers, ...(key ? { "x-api-key": key } : {}) };
  const hasBody = !["GET", "HEAD"].includes(method) && Boolean(body);
  const quote = (value) => "'" + String(value).replaceAll("'", "'\\''") + "'";
  if (language === "curl") {
    const lines = ["curl --request " + method + " " + quote(url)];
    Object.entries(forwarded).forEach(([name, value]) =>
      lines.push("  --header " + quote(name + ": " + value)),
    );
    if (hasBody) lines.push("  --data-raw " + quote(body));
    return lines.join(" \\\n");
  }
  if (language === "python") {
    return (
      "import requests\n\nresponse = requests.request(\n    " +
      JSON.stringify(method) +
      ",\n    " +
      JSON.stringify(url) +
      ",\n    headers=" +
      JSON.stringify(forwarded, null, 4).split("\n").join("\n    ") +
      (hasBody ? ",\n    data=" + JSON.stringify(body) : "") +
      ",\n    timeout=20,\n)\nprint(response.status_code)\nprint(response.text)"
    );
  }
  if (language === "axios") {
    const config = {
      url,
      method,
      headers: forwarded,
      ...(hasBody ? { data: body } : {}),
    };
    return (
      'import axios from "axios";\n\nconst response = await axios(' +
      JSON.stringify(config, null, 2) +
      ");\nconsole.log(response.data);"
    );
  }
  if (language === "go") {
    const headerLines = Object.entries(forwarded)
      .map(
        ([name, value]) =>
          "  req.Header.Set(" +
          JSON.stringify(name) +
          ", " +
          JSON.stringify(value) +
          ")",
      )
      .join("\n");
    return (
      'package main\n\nimport (\n  "fmt"\n  "io"\n  "net/http"\n  "strings"\n  "time"\n)\n\nfunc main() {\n  req, err := http.NewRequest(' +
      JSON.stringify(method) +
      ", " +
      JSON.stringify(url) +
      ", strings.NewReader(" +
      JSON.stringify(hasBody ? body : "") +
      "))\n  if err != nil { panic(err) }\n" +
      headerLines +
      "\n  client := &http.Client{Timeout: 20 * time.Second}\n  res, err := client.Do(req)\n  if err != nil { panic(err) }\n  defer res.Body.Close()\n  body, err := io.ReadAll(res.Body)\n  if err != nil { panic(err) }\n  fmt.Println(res.StatusCode, string(body))\n}"
    );
  }
  const options = { method, headers: forwarded, ...(hasBody ? { body } : {}) };
  return (
    "const response = await fetch(\n  " +
    JSON.stringify(url) +
    ",\n  " +
    JSON.stringify(options, null, 2).split("\n").join("\n  ") +
    '\n);\nif (!response.ok) throw new Error("HTTP " + response.status);\nconst text = await response.text();\nconst type = response.headers.get("content-type") || "";\nconst data = text && type.includes("json") ? JSON.parse(text) : text;\nconsole.log(data);'
  );
}
