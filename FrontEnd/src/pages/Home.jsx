import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CornerDownRight,
  Globe2,
  KeyRound,
  MoveRight,
  Play,
  Terminal,
  X,
} from "lucide-react";
import { GITHUB, PRESETS, PUBLIC_PROXY_ENDPOINT, proxyUrl } from "../lib/api";
import { CodeBlock, ExternalLink } from "../components/UI";

function QuickTest() {
  const [state, setState] = useState({
    loading: false,
    response: null,
    error: "",
  });
  const controller = useRef();
  useEffect(() => () => controller.current?.abort("unmount"), []);
  async function run() {
    controller.current = new AbortController();
    setState({ loading: true, response: null, error: "" });
    const timeout = setTimeout(
      () => controller.current?.abort("timeout"),
      20000,
    );
    const start = performance.now();
    try {
      const response = await fetch(proxyUrl(PRESETS[0].url), {
        signal: controller.current.signal,
      });
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.message || "HTTP " + response.status);
      setState({
        loading: false,
        response: {
          status: response.status,
          ms: Math.round(performance.now() - start),
          body,
        },
        error: "",
      });
    } catch (error) {
      if (controller.current?.signal.reason !== "unmount")
        setState({
          loading: false,
          response: null,
          error:
            controller.current?.signal.reason === "timeout"
              ? "The request timed out. Please try again."
              : error.message,
        });
    } finally {
      clearTimeout(timeout);
    }
  }
  return (
    <div className="quick-test">
      <div className="quick-test-top">
        <span>
          <Terminal size={15} /> A REAL REQUEST. RIGHT HERE.
        </span>
        <span className="mono">DEMO / 01</span>
      </div>
      <div className="quick-test-request">
        <span className="method-tag">GET</span>
        <span>jsonplaceholder.typicode.com/posts/1</span>
        <button
          className="button button-green"
          onClick={run}
          disabled={state.loading}
        >
          {state.loading ? (
            <span className="spinner" />
          ) : (
            <Play size={14} fill="currentColor" />
          )}
          {state.loading ? "Sending" : "Run request"}
        </button>
      </div>
      <div className="quick-test-response" aria-live="polite">
        {state.response ? (
          <>
            <div className="quick-result-meta">
              <span className="success-text">
                <Check size={14} />
                {state.response.status} OK
              </span>
              <span>
                {state.response.ms} ms{" "}
                <span className="muted">/ measured just now</span>
              </span>
            </div>
            <pre tabIndex={0} aria-label="API demo response">
              {JSON.stringify(state.response.body, null, 2)}
            </pre>
          </>
        ) : state.error ? (
          <p className="error-message" role="alert">
            {state.error} <Link to="/help">Get help</Link>
          </p>
        ) : (
          <div className="quick-empty">
            <CornerDownRight size={18} />
            <p>
              {state.loading
                ? "Your request is on its way."
                : "Press run. See a real API response."}
              <span>No signup needed for this demo.</span>
            </p>
          </div>
        )}
      </div>
      <Link className="quick-test-link" to="/playground">
        Open the full playground <ArrowUpRight size={14} />
      </Link>
    </div>
  );
}
export default function Home() {
  const integrationCode = [
    "// Replace with your public API URL.",
    'const target = "https://api.example.com/data";',
    "const proxy = new URL(" + JSON.stringify(PUBLIC_PROXY_ENDPOINT) + ");",
    'proxy.searchParams.set("Target", target);',
    "",
    "const response = await fetch(proxy, {",
    '  headers: { "x-api-key": "YOUR_EDUCORS_KEY" },',
    "});",
    'if (!response.ok) throw new Error("HTTP " + response.status);',
    "const data = await response.text();",
    "console.log(data);",
  ].join("\n");
  return (
    <div className="shell home">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="tiny-square" /> EDUCORS / THE CORS PROXY FOR YOUR
            APP
          </p>
          <h1>
            Bypass CORS.
            <br /> Connect to <span className="highlight">APIs.</span>
          </h1>
          <p className="hero-description">
            EduCors is a CORS proxy that lets your frontend call public APIs
            when browser CORS restrictions get in the way. Send requests through
            EduCors and get the API’s response back with the CORS headers your
            app needs.
          </p>
          <p className="hero-support">
            Use the proxy directly from your app. The playground is an optional
            place to check your requests.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#use-the-proxy">
              Start using the proxy
              <ArrowRight size={17} />
            </a>
            <Link className="text-link" to="/playground?preset=post">
              Test in playground
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <p className="hero-access">
            <Link to="/signUp">Get a free API key</Link> for your own public API
            URLs. Four demo requests are available without signing up.
          </p>
        </div>
        <div
          className="route-diagram"
          aria-label="Your browser sends a request to EduCors, which requests the target API and returns its response."
        >
          <div className="diagram-caption">
            <span className="mono">FIG. 01</span>
            <span>HOW THE PROXY HELPS</span>
          </div>
          <div className="diagram-lane">
            <div className="diagram-node">
              <Globe2 size={25} />
              <strong>Your browser</strong>
              <span>your-app.example</span>
            </div>
            <div className="route-line">
              <MoveRight size={23} />
              <span>request</span>
            </div>
            <div className="diagram-node target-node">
              <span className="mono braces">{"{ }"}</span>
              <strong>Target API</strong>
              <span>api.example.com</span>
            </div>
          </div>
          <div className="blocked-route">
            <span />
            <X size={12} />
            <span className="mono">CORS BLOCKED</span>
            <span />
          </div>
          <div className="proxy-route">
            <div className="proxy-route-rail" />
            <div className="proxy-node">
              <span className="proxy-logo">{"↔"}</span>
              <div>
                <strong>EduCors</strong>
                <span>Forwards your request</span>
              </div>
              <Check size={16} />
            </div>
            <div className="proxy-route-rail" />
          </div>
          <div className="diagram-bottom">
            <span className="status-dot online" /> Adds CORS headers to the API
            response.
          </div>
        </div>
      </section>
      <section
        className="principles"
        id="how-it-works"
        aria-labelledby="how-it-works-title"
      >
        <div className="section-title">
          <p className="eyebrow">FROM YOUR BROWSER TO THE API</p>
          <h2 id="how-it-works-title">How the CORS proxy works.</h2>
          <span className="mono">01 — 03</span>
        </div>
        <div className="principle-grid">
          {[
            {
              number: "01",
              icon: Globe2,
              title: "Your app calls EduCors.",
              text: "Point your fetch or Axios request at the EduCors endpoint. Include the public API’s URL and your EduCors key, along with any headers or payload the API needs.",
              link: "/documentation#endpoint",
              action: "See the proxy endpoint",
            },
            {
              number: "02",
              icon: Terminal,
              title: "The proxy calls the API.",
              text: "EduCors sends the request from its server. Browser CORS restrictions do not apply to this server-to-server request. The target API’s authentication still applies.",
              link: "/documentation#cors",
              action: "Understand the proxy",
            },
            {
              number: "03",
              icon: KeyRound,
              title: "Your app reads the response.",
              text: "EduCors returns the API’s status and response body with CORS headers. Your frontend can read the result and use it in your interface.",
              link: "/documentation#headers",
              action: "Read the integration guide",
            },
          ].map((item) => (
            <article key={item.number}>
              <div className="principle-top">
                <span>{item.number}</span>
                <item.icon size={21} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <Link className="text-link" to={item.link}>
                {item.action}
                <ArrowUpRight size={15} />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section
        className="home-integration"
        id="use-the-proxy"
        aria-labelledby="integration-title"
      >
        <div className="integration-intro">
          <p className="eyebrow">CONNECT YOUR APP</p>
          <h2 id="integration-title">Use EduCors in your frontend.</h2>
          <p>
            Route your API call through the proxy endpoint instead of calling
            the target directly. It works with fetch, Axios, React, Vue, and
            other clients that make HTTP requests.
          </p>
          <ol className="integration-steps">
            <li>
              <strong>Get your key.</strong> Create a free account and copy your
              EduCors key from the dashboard.
            </li>
            <li>
              <strong>Set your target.</strong> Add the public API’s full URL to
              the <code>Target</code> query parameter.
            </li>
            <li>
              <strong>Send the request.</strong> Include your key in{" "}
              <code>x-api-key</code> and read the returned response in your app.
            </li>
          </ol>
          <div className="integration-actions">
            <Link className="button button-green" to="/signUp">
              Get an API key <ArrowRight size={15} />
            </Link>
            <Link className="text-link" to="/documentation">
              Proxy documentation <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
        <div className="integration-example">
          <CodeBlock code={integrationCode} label="JavaScript / fetch" />
          <p className="field-help">
            Replace the example URL and <code>YOUR_EDUCORS_KEY</code> with your
            own values. This snippet calls the hosted EduCors proxy at{" "}
            <code>cors-proxy.brijeshhq.com</code>.
          </p>
        </div>
      </section>
      <section className="home-workbench">
        <div className="workbench-intro">
          <p className="eyebrow">OPTIONAL / TEST BEFORE YOU INTEGRATE</p>
          <h2>
            Check your request
            <br /> in the playground.
          </h2>
          <p>
            The playground helps you verify the proxy before using it in your
            app. Try a demo, inspect a response, or test your own URL with a
            key. You can use EduCors without opening the playground.
          </p>
          <Link className="text-link" to="/playground">
            Open the test playground
            <ArrowRight size={16} />
          </Link>
        </div>
        <QuickTest />
      </section>
      <section className="home-usecases" aria-labelledby="usecases-title">
        <div>
          <p className="eyebrow">WHO IT HELPS</p>
          <h2 id="usecases-title">Keep API integrations moving.</h2>
          <p className="usecases-intro">
            Use the proxy in a frontend project when a public API’s CORS
            configuration blocks direct browser requests.
          </p>
          <Link className="text-link" to="/about">
            About the project <ArrowUpRight size={15} />
          </Link>
        </div>
        <dl className="usecase-list">
          <div>
            <dt>Connect a frontend to a public API</dt>
            <dd>
              Route requests from React, Vue, or plain JavaScript through
              EduCors and use the API’s response in your app.
            </dd>
          </div>
          <div>
            <dt>Prototype without building a proxy</dt>
            <dd>
              Start an API integration using the hosted proxy endpoint, with
              support for request headers, bodies, and common HTTP methods.
            </dd>
          </div>
          <div>
            <dt>Check an integration before shipping</dt>
            <dd>
              Use the optional playground to inspect status codes and responses,
              then copy a request example into your project.
            </dd>
          </div>
        </dl>
      </section>
      <section className="home-note">
        <div className="note-icon">
          <CornerDownRight size={22} />
        </div>
        <div>
          <p className="eyebrow">WHEN TO USE A PROXY</p>
          <h2>
            Own the API?
            <br /> Configure CORS there.
          </h2>
          <p>
            If you control the API, configure its CORS headers directly. EduCors
            helps with permitted third-party integrations and learning; it
            doesn’t replace authentication or an API’s access rules.
          </p>
        </div>
        <Link className="button button-outline" to="/documentation#cors">
          Read the CORS guide
          <ArrowRight size={16} />
        </Link>
      </section>
      <section className="home-faq" aria-labelledby="proxy-faq-title">
        <div className="section-title">
          <p className="eyebrow">BEFORE YOU CONNECT</p>
          <h2 id="proxy-faq-title">A few practical answers.</h2>
        </div>
        {[
          {
            question: "Do I have to use the playground?",
            answer:
              "No. Your app can call the EduCors proxy endpoint directly. The playground is an optional tool for testing a request and generating integration examples.",
          },
          {
            question: "Do I need an EduCors API key?",
            answer:
              "Yes, for your own public API URLs. Create a free account to get a key and manage it from your dashboard. The four built-in demo requests work without a key.",
          },
          {
            question: "Can I forward more than GET requests?",
            answer:
              "Yes. The proxy supports GET, POST, PUT, PATCH, DELETE, and HEAD, including request headers and bodies where the method allows them. Private and local network targets are blocked.",
          },
          {
            question: "Will a CORS proxy fix API authentication errors?",
            answer:
              "EduCors handles browser CORS restrictions. If the target API needs a token, provide it in the Authorization header alongside your separate EduCors key. The API’s permissions and rate limits still apply.",
          },
        ].map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </section>
      <section className="home-closing">
        <p className="eyebrow">FREE TO EXPLORE / OPEN SOURCE</p>
        <h2>
          Put the proxy
          <br /> to work in your app.
        </h2>
        <p>
          Get your EduCors key, connect a public API, and let your frontend read
          the response. Test in the playground whenever you need to check a
          request.
        </p>
        <div className="closing-actions">
          <Link className="button button-dark" to="/signUp">
            Get your free API key <ArrowRight size={17} />
          </Link>
          <ExternalLink href={GITHUB} className="text-link">
            Explore the source
          </ExternalLink>
        </div>
      </section>
    </div>
  );
}
