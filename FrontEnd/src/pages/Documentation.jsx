import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, CornerDownRight } from "lucide-react";
import { generateCode, PRESETS, PUBLIC_PROXY_ENDPOINT } from "../lib/api";
import { CodeBlock, ExternalLink, PageHeading, Tabs } from "../components/UI";

const sections = [
  { id: "quickstart", name: "Quick start" },
  { id: "endpoint", name: "The endpoint" },
  { id: "authentication", name: "Authentication" },
  { id: "headers", name: "Headers & bodies" },
  { id: "limits", name: "Limits & boundaries" },
  { id: "errors", name: "Response codes" },
  { id: "cors", name: "Understanding CORS" },
];
export default function Documentation() {
  const [language, setLanguage] = useState("fetch");
  const languages = [
    { id: "fetch", label: "JavaScript" },
    { id: "curl", label: "cURL" },
    { id: "python", label: "Python" },
    { id: "axios", label: "Axios" },
    { id: "go", label: "Go" },
  ];
  return (
    <div className="shell docs-page">
      <PageHeading
        eyebrow="THE TOOLKIT / FIELD GUIDE"
        title="Use the CORS proxy."
      >
        Connect your app to EduCors, forward public API requests, and understand
        the responses. Use the playground whenever you want to test a request.
      </PageHeading>
      <div className="docs-layout">
        <nav className="docs-nav" aria-label="Documentation sections">
          <p className="eyebrow">IN THIS GUIDE</p>
          {sections.map((item, index) => (
            <a href={"#" + item.id} key={item.id}>
              <span className="mono">0{index + 1}</span>
              {item.name}
            </a>
          ))}
          <Link className="text-link" to="/playground">
            Try the playground
            <ArrowUpRight size={14} />
          </Link>
        </nav>
        <div className="docs-content">
          <section id="quickstart">
            <p className="eyebrow">01 / QUICK START</p>
            <h2>A request in a few lines.</h2>
            <p>
              This example calls a real demo endpoint and needs no API key. Pick
              your language, copy the code, and run it. The examples use the
              hosted proxy at <code>cors-proxy.brijeshhq.com</code>.
            </p>
            <Tabs
              label="Example language"
              items={languages}
              value={language}
              onChange={setLanguage}
            />
            <div
              id="example-language-panel"
              role="tabpanel"
              aria-labelledby={"example-language-" + language}
            >
              <CodeBlock
                label={languages.find((item) => item.id === language).label}
                code={generateCode({
                  target: PRESETS[0].url,
                  language,
                  headers: { Accept: "application/json" },
                })}
              />
            </div>
            <p className="docs-note">
              <CornerDownRight size={16} />
              For your own target URL,{" "}
              <Link to="/signUp">create an account</Link> and add your key to
              the <code>x-api-key</code> header.
            </p>
          </section>
          <section id="endpoint">
            <p className="eyebrow">02 / THE ENDPOINT</p>
            <h2>One route. Your HTTP method.</h2>
            <div className="endpoint-definition">
              <span className="method-tag">ALL</span>
              <code>{PUBLIC_PROXY_ENDPOINT}?Target=ENCODED_URL</code>
            </div>
            <p>
              Send GET, POST, PUT, PATCH, DELETE, or HEAD. The proxy sends the
              same method to the upstream API and returns its status and body.
              Browser OPTIONS preflights are handled by the gateway.
            </p>
            <div
              className="table-scroll"
              tabIndex={0}
              aria-label="API reference table"
            >
              <table>
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Where</th>
                    <th>What it does</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>Target</code>
                    </td>
                    <td>Query · required</td>
                    <td>
                      The full HTTP or HTTPS target URL. Encode it with{" "}
                      <code>URLSearchParams</code>.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>x-api-key</code>
                    </td>
                    <td>Header</td>
                    <td>Your EduCors key, required for custom targets.</td>
                  </tr>
                  <tr>
                    <td>Request body</td>
                    <td>Body · optional</td>
                    <td>
                      Forwarded as supplied for methods that accept a body.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <section id="authentication">
            <p className="eyebrow">03 / AUTHENTICATION</p>
            <h2>Two keys, two different jobs.</h2>
            <p>
              Your EduCors key authenticates with the gateway. If the target API
              requires its own token, send that separately in{" "}
              <code>Authorization</code>. EduCors removes its own key before
              forwarding.
            </p>
            <CodeBlock
              label="Request headers"
              code={
                '{\n  "x-api-key": "YOUR_EDUCORS_KEY",\n  "Authorization": "Bearer YOUR_UPSTREAM_TOKEN",\n  "Accept": "application/json"\n}'
              }
            />
            <p>
              EduCors reads its key only from <code>x-api-key</code>, so{" "}
              <code>Authorization</code> always reaches the target API. Account
              sessions use an HTTP-only cookie. Key rotation invalidates the old
              key immediately.
            </p>
            <Link className="text-link" to="/profile">
              Manage your key
              <ArrowRight size={14} />
            </Link>
          </section>
          <section id="headers">
            <p className="eyebrow">04 / HEADERS & BODIES</p>
            <h2>The payload goes through intact.</h2>
            <p>
              When <code>Target</code> is in the query string, the request body
              is forwarded without removing fields or wrapping your JSON. Set
              the matching <code>Content-Type</code> yourself.
            </p>
            <CodeBlock
              label="cURL · JSON body"
              code={generateCode({
                target: PRESETS[1].url,
                method: "POST",
                body: PRESETS[1].body,
                headers: { "Content-Type": "application/json" },
                language: "curl",
              })}
            />
            <p>
              Cookies, hop-by-hop headers, browser origin metadata, and the
              gateway API key are stripped. Upstream content type, ETag, and
              Last-Modified are preserved. Extra response headers report rate
              limits, the gateway mode, and measured upstream latency.
            </p>
          </section>
          <section id="limits">
            <p className="eyebrow">05 / LIMITS & BOUNDARIES</p>
            <h2>A helper with sensible edges.</h2>
            <div className="limits-grid">
              <div>
                <strong>10 / min</strong>
                <span>Public demo · per IP</span>
              </div>
              <div>
                <strong>120 / min</strong>
                <span>Authenticated · per key</span>
              </div>
              <div>
                <strong>15 seconds</strong>
                <span>Upstream timeout</span>
              </div>
              <div>
                <strong>1 MB / 5 MB</strong>
                <span>Request / response limits</span>
              </div>
            </div>
            <p>
              Demo access is limited to the four preset endpoints in the
              playground. An account key enables custom public endpoints on
              standard HTTP/HTTPS ports.
            </p>
            <ul>
              <li>
                Private, loopback, reserved, and link-local IPs are blocked,
                including addresses returned by DNS.
              </li>
              <li>
                Validated DNS addresses are pinned for the connection. Redirects
                are rejected; use the final target URL.
              </li>
              <li>
                Responses are buffered up to the size limit. This gateway does
                not support WebSockets or long-lived event streams.
              </li>
              <li>
                Rate limits use a rolling window within each server process.
                Deployments with multiple instances need a shared limiter.
              </li>
              <li>
                Responses are not cached. Use the service for requests the
                target API allows, and follow that API’s rate limits and terms.
              </li>
            </ul>
          </section>
          <section id="errors">
            <p className="eyebrow">06 / RESPONSE CODES</p>
            <h2>A status code is a clue.</h2>
            <div
              className="table-scroll"
              tabIndex={0}
              aria-label="API reference table"
            >
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Meaning</th>
                    <th>Next step</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "400",
                      "Invalid target or request",
                      "Check the URL, protocol, headers, and body.",
                    ],
                    [
                      "401",
                      "Missing or invalid key/session",
                      "Use a demo preset or your current API key.",
                    ],
                    [
                      "403",
                      "Account origin not allowed",
                      "Configure FRONTEND_URL for your deployment.",
                    ],
                    [
                      "413",
                      "Request too large",
                      "Keep your request body below 1 MB.",
                    ],
                    [
                      "429",
                      "Request limit reached",
                      "Wait for the Retry-After interval.",
                    ],
                    [
                      "502",
                      "Upstream failed, redirected, or too large",
                      "Check the final target URL and response size.",
                    ],
                    [
                      "503",
                      "Account storage or service unavailable",
                      "Try again shortly; local setups need MongoDB.",
                    ],
                    [
                      "504",
                      "Upstream timed out",
                      "Check target availability and try a smaller request.",
                    ],
                  ].map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell, index) => (
                        <td key={index}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              An upstream API’s own error status is returned unchanged. Check
              the response body to distinguish an upstream error from a gateway
              error.
            </p>
          </section>
          <section id="cors">
            <p className="eyebrow">07 / UNDERSTANDING CORS</p>
            <h2>What the browser is protecting.</h2>
            <p>
              CORS is a browser mechanism that controls whether scripts can read
              responses from a different origin. The API decides which origins
              can read its responses using HTTP headers; the browser enforces
              that policy.
            </p>
            <div className="decision-note">
              <strong>You own the API?</strong>
              <p>
                Configure <code>Access-Control-Allow-Origin</code>, allowed
                methods, and preflight responses on your server. Prefer explicit
                trusted origins for private or credentialed APIs.
              </p>
            </div>
            <div className="decision-note">
              <strong>You’re using a third-party API?</strong>
              <p>
                Check its browser support and access rules first. A server-side
                proxy can help with an integration you’re permitted to use. It
                doesn’t bypass authentication or grant access to protected data.
              </p>
            </div>
            <p>
              Setting <code>mode: "no-cors"</code> doesn’t fix readable JSON
              requests: it produces an opaque response that your JavaScript
              cannot inspect.
            </p>
            <ExternalLink
              className="text-link"
              href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS"
            >
              Read the browser’s side of the story on MDN
            </ExternalLink>
          </section>
        </div>
      </div>
    </div>
  );
}
