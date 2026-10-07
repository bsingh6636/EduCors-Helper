import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { useApp } from "../context";
import { api, generateCode, PRESETS } from "../lib/api";
import { CodeBlock, CopyButton, PageHeading } from "../components/UI";

export default function Dashboard() {
  const { user, setUser, authLoading, signOut, notify } = useApp();
  const navigate = useNavigate();
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [rotating, setRotating] = useState(false);
  const dialog = useRef();
  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setUsage(await api("/apiUsage"));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (user?._id) refresh();
  }, [user?._id, refresh]);
  useEffect(() => {
    if (rotate) dialog.current?.showModal();
    else dialog.current?.close();
  }, [rotate]);
  async function rotateKey() {
    setRotating(true);
    try {
      const result = await api("/regenerateApiKey", {
        method: "POST",
        body: "{}",
      });
      setUser({ ...user, ApiKey: result.data });
      setRotate(false);
      notify("Key rotated. Update integrations using the previous key.");
    } catch (error) {
      notify(error.message);
    } finally {
      setRotating(false);
    }
  }
  async function logout() {
    try {
      await signOut();
      navigate("/signIn");
    } catch (error) {
      notify(error.message);
    }
  }
  if (authLoading)
    return (
      <div className="shell page-loading" role="status">
        Checking your session…
      </div>
    );
  if (!user)
    return (
      <div className="shell signed-out">
        <KeyRound size={36} strokeWidth={1.4} />
        <p className="eyebrow">YOUR DEVELOPER DESK</p>
        <h1>A key to your next project.</h1>
        <p>Sign in to manage your API key and see your own request activity.</p>
        <div className="hero-actions">
          <Link className="button button-green" to="/signIn">
            Sign in
            <ArrowRight size={16} />
          </Link>
          <Link className="button button-outline" to="/signUp">
            Create account
          </Link>
        </div>
      </div>
    );
  const maxCalls = Math.max(1, ...(usage?.days || []).map((day) => day.calls));
  const today = usage?.days?.[6]?.calls;
  return (
    <div className="shell dashboard-page">
      <PageHeading
        eyebrow={"YOUR DEVELOPER DESK / @" + user.UserName}
        title={"Hello, " + user.Name.split(" ")[0] + "."}
        action={
          <button
            className="button button-outline button-small"
            onClick={logout}
          >
            <LogOut size={15} />
            Sign out
          </button>
        }
      >
        Your key, your requests, and a little clarity.
      </PageHeading>
      {error && (
        <p className="error-message" role="alert">
          {error} <button onClick={refresh}>Try again</button>
        </p>
      )}
      <div className="dashboard-stats">
        {[
          {
            label: "TOTAL REQUESTS",
            value: usage ? usage.totalApiCalls.toLocaleString() : "—",
            note: "Across your account",
          },
          {
            label: "REQUESTS TODAY",
            value: today !== undefined ? today : "—",
            note: "Since midnight UTC",
          },
          {
            label: "RECENT AVG. LATENCY",
            value:
              usage?.averageLatencyMs !== null &&
              usage?.averageLatencyMs !== undefined
                ? usage.averageLatencyMs + " ms"
                : "—",
            note: "From your last 30 calls",
          },
          {
            label: "YOUR RATE LIMIT",
            value: "120",
            note: "Requests / minute / key",
          },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="eyebrow">{stat.label}</p>
            <strong>{stat.value}</strong>
            <span>{stat.note}</span>
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        <section className="key-panel">
          <div className="panel-heading">
            <span>
              <KeyRound size={15} />
              YOUR API KEY
            </span>
            <span className="success-text">
              <span className="status-dot online" />
              ACTIVE
            </span>
          </div>
          <div className="key-panel-body">
            <h2>
              A small key.
              <br /> A useful door.
            </h2>
            <p>
              Send it in the <code>x-api-key</code> header. Keep it out of
              public repositories and rotate it when needed.
            </p>
            <div className="dashboard-key">
              <input
                aria-label="Your API key"
                type={showKey ? "text" : "password"}
                readOnly
                value={user.ApiKey || ""}
              />
              <button
                className="icon-button"
                aria-label={showKey ? "Hide key" : "Reveal key"}
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <CopyButton text={user.ApiKey || ""} />
            </div>
            <div className="key-panel-actions">
              <button className="text-link" onClick={() => setRotate(true)}>
                <RefreshCw size={13} />
                Rotate key
              </button>
              <Link className="text-link" to="/playground">
                Put it to work
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
        <section className="usage-panel">
          <div className="panel-heading">
            <span>THE PAST SEVEN DAYS</span>
            <button
              className="copy-button"
              onClick={refresh}
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? "spin" : ""} />
              {loading ? "Loading" : "Refresh"}
            </button>
          </div>
          <div
            className="usage-chart"
            role="img"
            aria-label={
              (usage?.days || [])
                .map((day) => day.date + ": " + day.calls + " requests")
                .join(", ") || "Usage chart loading"
            }
          >
            {(
              usage?.days ||
              Array.from({ length: 7 }, (_, i) => ({
                date: "Day " + (i + 1),
                calls: 0,
              }))
            ).map((day) => (
              <div className="chart-column" key={day.date}>
                <span className="chart-value">{usage ? day.calls : "—"}</span>
                <div className="chart-track">
                  <div
                    style={{
                      height:
                        Math.max(
                          day.calls ? 6 : 0,
                          (day.calls / maxCalls) * 100,
                        ) + "%",
                    }}
                  />
                </div>
                <span>
                  {usage
                    ? new Date(day.date + "T12:00:00Z").toLocaleDateString(
                        "en",
                        { weekday: "short", timeZone: "UTC" },
                      )
                    : "—"}
                </span>
              </div>
            ))}
          </div>
          <p className="chart-note">
            Request counts use UTC. Click Refresh after testing an integration.
          </p>
        </section>
      </div>
      <section className="dashboard-quickstart">
        <div>
          <p className="eyebrow">YOUR FIRST INTEGRATION</p>
          <h2>Copy. Paste. Request.</h2>
          <p>An example using your current key and the hosted EduCors proxy.</p>
          <Link className="text-link" to="/documentation">
            Read the API reference
            <ArrowRight size={14} />
          </Link>
        </div>
        <CodeBlock
          label="cURL"
          code={generateCode({
            target: PRESETS[0].url,
            key: user.ApiKey,
            language: "curl",
          })}
        />
      </section>
      <section className="activity-panel">
        <div className="panel-heading">
          <span>RECENT ACTIVITY</span>
          <span className="mono">LAST 30 REQUESTS</span>
        </div>
        {usage?.recentLogs?.length ? (
          <div
            className="table-scroll"
            tabIndex={0}
            aria-label="Recent API activity"
          >
            <table>
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Endpoint</th>
                  <th>Status</th>
                  <th>Latency</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {usage.recentLogs.map((log, index) => (
                  <tr key={index}>
                    <td>
                      <span className="method-tag">{log.method}</span>
                    </td>
                    <td className="endpoint-cell" title={log.endpoint}>
                      {log.endpoint}
                    </td>
                    <td
                      className={
                        log.statusCode < 400 ? "success-text" : "error-text"
                      }
                    >
                      {log.statusCode}
                    </td>
                    <td>{log.latencyMs} ms</td>
                    <td>
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="activity-empty">
            <Check size={24} strokeWidth={1.3} />
            <h3>{loading ? "Fetching your activity." : "A clean slate."}</h3>
            <p>
              {loading
                ? "One moment."
                : "Requests made with your key will appear here."}
            </p>
            <Link className="text-link" to="/playground">
              Send your first request
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>
      <div className="account-note">
        <span>ACCOUNT</span>
        <span>{user.Email}</span>
        <span>
          Joined{" "}
          {new Date(user.createdAt).toLocaleDateString([], {
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
      <dialog
        ref={dialog}
        className="rotate-dialog"
        aria-labelledby="rotate-title"
        onCancel={() => setRotate(false)}
      >
        <p className="eyebrow">KEY MANAGEMENT</p>
        <h2 id="rotate-title">Time for a new key?</h2>
        <p>
          Your current key will stop working immediately. Update any
          applications or scripts that use it.
        </p>
        <div className="dialog-actions">
          <button
            className="button button-outline"
            onClick={() => setRotate(false)}
            disabled={rotating}
          >
            Keep current key
          </button>
          <button
            className="button button-green"
            onClick={rotateKey}
            disabled={rotating}
          >
            {rotating ? "Rotating…" : "Rotate key"}
            <RefreshCw size={14} />
          </button>
        </div>
      </dialog>
    </div>
  );
}
