import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowDownToLine,
  ArrowRight,
  Braces,
  Check,
  Clock3,
  Eye,
  EyeOff,
  FileJson,
  Send,
  Square,
  Terminal,
} from "lucide-react";
import { useApp } from "../context";
import {
  PRESETS,
  generateCode,
  headerApiKey,
  isDemoRequest,
  parseHeaders,
  proxyUrl,
  validateRequest,
} from "../lib/api";
import { CodeBlock, CopyButton, PageHeading, Tabs } from "../components/UI";

const languages = [
  { id: "fetch", label: "JavaScript" },
  { id: "curl", label: "cURL" },
  { id: "python", label: "Python" },
  { id: "axios", label: "Axios" },
  { id: "go", label: "Go" },
];
export default function Playground() {
  const { user } = useApp();
  const [params] = useSearchParams();
  const initial =
    PRESETS.find((preset) => preset.id === params.get("preset")) || PRESETS[0];
  const [selected, setSelected] = useState(initial.id);
  const [method, setMethod] = useState(initial.method);
  const [target, setTarget] = useState(initial.url);
  const [body, setBody] = useState(initial.body);
  const [headerText, setHeaderText] = useState(
    '{\n  "Accept": "application/json"\n}',
  );
  const [key, setKey] = useState(user?.ApiKey || "");
  const [showKey, setShowKey] = useState(false);
  const [configTab, setConfigTab] = useState("headers");
  const [responseTab, setResponseTab] = useState("body");
  const [language, setLanguage] = useState("fetch");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationField, setValidationField] = useState("");
  const [response, setResponse] = useState(null);
  const [history, setHistory] = useState([]);
  const controller = useRef();
  const demoRequest = isDemoRequest(target, method);
  let hasHeaderKey = false;
  try {
    hasHeaderKey = Boolean(headerApiKey(parseHeaders(headerText)));
  } catch {
    // Malformed headers are explained when the request is submitted.
  }
  function clearValidation() {
    setError("");
    setValidationField("");
  }
  useEffect(() => {
    if (user?.ApiKey) setKey(user.ApiKey);
  }, [user?.ApiKey]);
  useEffect(() => () => controller.current?.abort(), []);
  const load = useCallback(
    (preset) => {
      if (loading) controller.current?.abort();
      setSelected(preset.id || "");
      setMethod(preset.method);
      setTarget(preset.url);
      setBody(preset.body || "");
      setHeaderText(
        JSON.stringify(
          {
            Accept: "application/json",
            ...(preset.body ? { "Content-Type": "application/json" } : {}),
          },
          null,
          2,
        ),
      );
      setConfigTab(preset.body ? "body" : "headers");
      setError("");
      setValidationField("");
      setResponse(null);
    },
    [loading],
  );
  const presetId = params.get("preset");
  useEffect(() => {
    const preset = PRESETS.find((item) => item.id === presetId);
    if (preset) {
      setSelected(preset.id);
      setMethod(preset.method);
      setTarget(preset.url);
      setBody(preset.body);
      setHeaderText(
        JSON.stringify(
          {
            Accept: "application/json",
            ...(preset.body ? { "Content-Type": "application/json" } : {}),
          },
          null,
          2,
        ),
      );
    }
  }, [presetId]);
  let code = "",
    codeError = "";
  try {
    code = generateCode({
      target,
      method,
      body,
      headers: parseHeaders(headerText),
      key,
      language,
    });
  } catch (error) {
    codeError = "Enter a valid URL and headers to generate code.";
  }
  async function send(event) {
    event?.preventDefault();
    if (loading) return;
    clearValidation();
    setResponse(null);
    let url, headers;
    try {
      ({ url, headers } = validateRequest({
        target,
        method,
        headerText,
        body,
        key,
      }));
    } catch (error) {
      setError(error.message);
      setValidationField(error.field || "");
      if (["headers", "body"].includes(error.field)) setConfigTab(error.field);
      const fieldIds = {
        target: "request-target",
        method: "request-method",
        key: "proxy-key",
        headers: "request-headers",
        body: "request-body",
      };
      requestAnimationFrame(() =>
        document.getElementById(fieldIds[error.field])?.focus(),
      );
      return;
    }
    controller.current = new AbortController();
    const timer = setTimeout(() => controller.current?.abort("timeout"), 20000);
    setLoading(true);
    const started = performance.now();
    try {
      const result = await fetch(proxyUrl(url.href), {
        method,
        headers,
        ...(!["GET", "HEAD"].includes(method) && body ? { body } : {}),
        signal: controller.current.signal,
      });
      const bytes = await result.arrayBuffer();
      const text = new TextDecoder().decode(bytes);
      const type = result.headers.get("content-type") || "";
      let formatted = text;
      if (type.includes("json")) {
        try {
          formatted = JSON.stringify(JSON.parse(text), null, 2);
        } catch {
          /* Show malformed upstream JSON as text. */
        }
      }
      const measured = Math.round(performance.now() - started);
      const next = {
        status: result.status,
        statusText: result.statusText,
        text: formatted,
        raw: bytes,
        headers: Object.fromEntries(result.headers.entries()),
        ms: measured,
        size: bytes.byteLength,
        type,
        binary:
          !type.includes("json") &&
          !type.startsWith("text/") &&
          !type.includes("xml") &&
          !type.includes("javascript") &&
          bytes.byteLength > 0,
      };
      setResponse(next);
      setResponseTab("body");
      setHistory((previous) =>
        [
          { method, url: url.href, body, status: result.status, ms: measured },
          ...previous,
        ].slice(0, 5),
      );
    } catch (error) {
      setError(
        controller.current?.signal.aborted
          ? controller.current.signal.reason === "timeout"
            ? "The request timed out. Try again or check the target API."
            : "Request cancelled."
          : "Could not reach the proxy. Check your connection and try again.",
      );
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([response.raw], {
        type: response.type || "application/octet-stream",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = response.type.includes("json")
      ? "educors-response.json"
      : response.type.startsWith("text/")
        ? "educors-response.txt"
        : "educors-response.bin";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function formatBody() {
    try {
      setBody(JSON.stringify(JSON.parse(body), null, 2));
      setError("");
    } catch {
      setError(
        "The body contains invalid JSON. Check the syntax before formatting.",
      );
    }
  }
  return (
    <div className="shell playground-page">
      <PageHeading eyebrow="THE TOOLKIT / PLAYGROUND" title="Make the request.">
        A URL, a few headers, and a useful answer. Let’s see what comes back.
      </PageHeading>
      <div className="workspace">
        <aside className="workspace-sidebar">
          <div className="sidebar-title">
            <span className="eyebrow">START WITH AN EXAMPLE</span>
            <span className="mono">04</span>
          </div>
          <div className="preset-list">
            {PRESETS.map((preset, index) => (
              <button
                key={preset.id}
                className={
                  "preset " + (selected === preset.id ? "selected" : "")
                }
                onClick={() => load(preset)}
                disabled={loading}
              >
                <span className="preset-index">0{index + 1}</span>
                <span>
                  <strong>{preset.title}</strong>
                  <small>{preset.description}</small>
                </span>
                <ArrowRight size={14} />
              </button>
            ))}
          </div>
          <div className="sidebar-note">
            <span className="method-tag">DEMO ACCESS</span>
            <p>
              These examples work without a key. Up to 10 requests per minute.
            </p>
            <p>
              For your own endpoints, create a free account and use your API
              key.
            </p>
            <Link className="text-link" to={user ? "/profile" : "/signUp"}>
              {user ? "Your API key" : "Get a free key"}
              <ArrowRight size={14} />
            </Link>
          </div>
          {history.length > 0 && (
            <div className="request-history">
              <p className="eyebrow">THIS SESSION</p>
              {history.map((item, index) => (
                <button
                  key={index}
                  disabled={loading}
                  onClick={() => load(item)}
                  title={item.url}
                >
                  <span
                    className={
                      "history-status " +
                      (item.status < 400 ? "success-text" : "error-text")
                    }
                  >
                    {item.status}
                  </span>
                  <span>
                    {item.method} {new URL(item.url).hostname}
                  </span>
                  <Clock3 size={12} />
                </button>
              ))}
            </div>
          )}
        </aside>
        <div className="workspace-main">
          <section className="request-panel" aria-label="Request configuration">
            <div className="panel-heading">
              <span>
                <span className="tiny-square" /> REQUEST
              </span>
              <span className="mono">HTTP / HTTPS</span>
            </div>
            <form
              noValidate
              onSubmit={send}
              onKeyDown={(event) => {
                if (
                  (event.metaKey || event.ctrlKey) &&
                  event.key === "Enter" &&
                  !loading
                )
                  send(event);
              }}
            >
              <div className="request-url-row">
                <select
                  id="request-method"
                  aria-label="HTTP method"
                  value={method}
                  disabled={loading}
                  onChange={(event) => {
                    setMethod(event.target.value);
                    setSelected("");
                    clearValidation();
                  }}
                >
                  {["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"].map(
                    (value) => (
                      <option key={value}>{value}</option>
                    ),
                  )}
                </select>
                <input
                  id="request-target"
                  aria-label="Target URL"
                  type="url"
                  required
                  aria-invalid={validationField === "target"}
                  aria-describedby={
                    validationField === "target" ? "request-error" : undefined
                  }
                  value={target}
                  disabled={loading}
                  onChange={(event) => {
                    setTarget(event.target.value);
                    setSelected("");
                    clearValidation();
                  }}
                  placeholder="https://api.example.com/data"
                />
                <button
                  className="button button-green"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? <span className="spinner" /> : <Send size={15} />}
                  {loading ? "Sending" : "Send request"}
                </button>
              </div>
              <div className="key-row">
                <label htmlFor="proxy-key">
                  API key{" "}
                  <span className="muted">
                    {demoRequest
                      ? "(optional for this demo)"
                      : hasHeaderKey
                        ? "(provided in headers)"
                        : "(required)"}
                  </span>
                </label>
                <div className="key-input">
                  <input
                    id="proxy-key"
                    type={showKey ? "text" : "password"}
                    value={key}
                    required={!demoRequest && !hasHeaderKey}
                    aria-invalid={validationField === "key"}
                    aria-describedby={
                      validationField === "key"
                        ? "key-help request-error"
                        : "key-help"
                    }
                    onChange={(event) => {
                      setKey(event.target.value);
                      clearValidation();
                    }}
                    disabled={loading}
                    autoComplete="off"
                    spellCheck="false"
                    placeholder="ec_…"
                  />
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => setShowKey(!showKey)}
                    aria-label={showKey ? "Hide API key" : "Show API key"}
                  >
                    {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <p className="request-access-note field-help" id="key-help">
                {demoRequest
                  ? "This demo URL and method work without a key (10 requests/minute)."
                  : "Custom URLs and methods require your EduCors key. Add it here or in the request headers."}{" "}
                <Link to={user ? "/profile" : "/signUp"}>
                  {user ? "Find your key" : "Get a free key"}
                </Link>
                .
              </p>
            </form>
            <Tabs
              label="Request options"
              items={[
                { id: "headers", label: "Headers" },
                { id: "body", label: "Body" },
                { id: "code", label: "Integration code" },
              ]}
              value={configTab}
              onChange={setConfigTab}
            />
            <div
              className="request-config"
              id="request-options-panel"
              role="tabpanel"
              aria-labelledby={"request-options-" + configTab}
            >
              {configTab === "headers" && (
                <>
                  <div className="editor-label">
                    <label htmlFor="request-headers">
                      Headers as a JSON object
                    </label>
                    <span className="mono">KEY : VALUE</span>
                  </div>
                  <textarea
                    id="request-headers"
                    className="code-editor"
                    value={headerText}
                    aria-invalid={validationField === "headers"}
                    aria-describedby={
                      validationField === "headers"
                        ? "request-error"
                        : undefined
                    }
                    onChange={(event) => {
                      setHeaderText(event.target.value);
                      clearValidation();
                    }}
                    disabled={loading}
                    spellCheck="false"
                  />
                  <p className="field-help">
                    Use <code>x-api-key</code> for EduCors. Your{" "}
                    <code>Authorization</code> header can authenticate with the
                    target API.
                  </p>
                </>
              )}
              {configTab === "body" && (
                <>
                  <div className="editor-label">
                    <label htmlFor="request-body">Request body</label>
                    <button
                      className="copy-button"
                      type="button"
                      onClick={formatBody}
                      disabled={!body}
                    >
                      <Braces size={13} />
                      Format JSON
                    </button>
                  </div>
                  <textarea
                    id="request-body"
                    className="code-editor"
                    value={body}
                    aria-invalid={validationField === "body"}
                    aria-describedby={
                      validationField === "body" ? "request-error" : undefined
                    }
                    onChange={(event) => {
                      setBody(event.target.value);
                      clearValidation();
                    }}
                    spellCheck="false"
                    disabled={loading || ["GET", "HEAD"].includes(method)}
                    placeholder={
                      ["GET", "HEAD"].includes(method)
                        ? "GET and HEAD requests do not send a body."
                        : '{ "hello": "world" }'
                    }
                  />
                  <p className="field-help">
                    For JSON payloads, add{" "}
                    <code>Content-Type: application/json</code> in Headers.
                  </p>
                </>
              )}
              {configTab === "code" && (
                <>
                  <div className="editor-label">
                    <label htmlFor="request-code-language">
                      Use this request in your project
                    </label>
                    <select
                      id="request-code-language"
                      value={language}
                      onChange={(event) => setLanguage(event.target.value)}
                    >
                      {languages.map((item) => (
                        <option value={item.id} key={item.id}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {codeError ? (
                    <p className="field-help">{codeError}</p>
                  ) : (
                    <CodeBlock
                      code={code}
                      label={
                        languages.find((item) => item.id === language).label
                      }
                    />
                  )}
                </>
              )}
            </div>
            <div className="request-footer">
              <span className="mono">⌘ / CTRL + ENTER TO SEND</span>
              {loading ? (
                <button
                  className="text-link"
                  onClick={() => controller.current?.abort()}
                >
                  <Square size={12} />
                  Cancel request
                </button>
              ) : (
                <Link to="/documentation#limits">
                  View limits
                  <ArrowRight size={12} />
                </Link>
              )}
            </div>
          </section>
          {error && (
            <div
              className="error-message workspace-error"
              role="alert"
              id="request-error"
            >
              {error}
            </div>
          )}
          <section
            className="response-panel"
            aria-label="API response"
            aria-busy={loading}
          >
            <div className="panel-heading">
              <span>
                <span className="tiny-square" /> RESPONSE
              </span>
              {response ? (
                <div
                  className="response-metrics"
                  role="status"
                  aria-live="polite"
                >
                  <span
                    className={
                      "response-status " +
                      (response.status < 400 ? "success-text" : "error-text")
                    }
                  >
                    {response.status} {response.statusText}
                  </span>
                  <span>{response.ms} ms</span>
                  <span>
                    {response.size < 1024
                      ? response.size + " B"
                      : (response.size / 1024).toFixed(1) + " KB"}
                  </span>
                </div>
              ) : (
                <span className="mono">
                  {loading ? "WAITING FOR UPSTREAM" : "READY WHEN YOU ARE"}
                </span>
              )}
            </div>
            {response ? (
              <>
                <div className="response-toolbar">
                  <Tabs
                    label="Response view"
                    items={[
                      { id: "body", label: "Body" },
                      { id: "headers", label: "Headers" },
                    ]}
                    value={responseTab}
                    onChange={setResponseTab}
                  />
                  <div className="response-actions">
                    <CopyButton
                      text={
                        responseTab === "headers"
                          ? JSON.stringify(response.headers, null, 2)
                          : response.text
                      }
                    />
                    <button className="copy-button" onClick={download}>
                      <ArrowDownToLine size={14} />
                      Save
                    </button>
                  </div>
                </div>
                <div
                  className="response-content"
                  id="response-view-panel"
                  tabIndex={0}
                  role="tabpanel"
                  aria-labelledby={"response-view-" + responseTab}
                >
                  {responseTab === "headers" ? (
                    <dl className="response-headers">
                      {Object.entries(response.headers).map(([name, value]) => (
                        <div key={name}>
                          <dt>{name}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : response.binary ? (
                    <div className="binary-response">
                      <FileJson size={28} />
                      <p>Binary response · {response.type}</p>
                      <button
                        className="button button-outline"
                        onClick={download}
                      >
                        Download response
                        <ArrowDownToLine size={15} />
                      </button>
                    </div>
                  ) : (
                    <pre className="response-body">
                      {response.text || "(Empty response body)"}
                    </pre>
                  )}
                </div>
                {response.status >= 400 && (
                  <p className="response-error-help">
                    Check the returned message or{" "}
                    <Link to="/help">open the troubleshooting guide</Link>.
                  </p>
                )}
              </>
            ) : (
              <div className="response-empty">
                {loading ? (
                  <span className="spinner large-spinner" />
                ) : (
                  <Terminal size={30} strokeWidth={1.3} />
                )}
                <h2>
                  {loading
                    ? "Following the request."
                    : "Your response goes here."}
                </h2>
                <p>
                  {loading
                    ? "Connecting to the target through EduCors."
                    : "Send a request to inspect its body, headers, and timing."}
                </p>
                {!loading && (
                  <span className="mono">NO MOCK DATA. THE REAL THING.</span>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
      <div className="workbench-bottom">
        <Check size={15} />
        <p>
          Private networks are blocked. Upstream status codes are preserved.{" "}
          <Link to="/documentation">See how the proxy works.</Link>
        </p>
      </div>
    </div>
  );
}
