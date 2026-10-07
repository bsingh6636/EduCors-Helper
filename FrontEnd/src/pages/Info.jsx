import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, CornerDownRight } from "lucide-react";
import { GITHUB } from "../lib/api";
import { ExternalLink, PageHeading } from "../components/UI";

const titles = {
  about: "Built to learn. Shared to help.",
  help: "Let’s follow the error.",
  contact: "Keep the conversation useful.",
  privacy: "A straightforward privacy note.",
  missing: "Nothing at this endpoint.",
};
export default function Info({ page }) {
  return (
    <div className="shell info-page">
      <PageHeading
        eyebrow={
          page === "missing"
            ? "404 / PAGE NOT FOUND"
            : "THE PROJECT / " + page.toUpperCase()
        }
        title={titles[page]}
      />
      <div className="info-layout">
        <aside>
          <CornerDownRight size={30} strokeWidth={1.3} />
          <p className="mono">
            A LITTLE CONTEXT
            <br /> GOES A LONG WAY.
          </p>
        </aside>
        <div className="prose">
          {page === "about" && (
            <>
              <p className="prose-lead">
                EduCors is a CORS proxy for frontend apps. It helps you call
                public APIs when browser CORS restrictions block direct
                requests.
              </p>
              <p>
                I’m Brijesh Kushwaha, a full stack developer. I built this
                project to understand the request lifecycle, make API
                integrations easier, and share a proxy others can use in their
                own projects.
              </p>
              <h2>A proxy you can use from your app.</h2>
              <p>
                Your frontend calls the EduCors endpoint with a target URL and
                your API key. The server forwards the request and returns the
                API’s response with CORS headers. An optional playground helps
                you test requests, while the dashboard lets you manage your key
                and review your activity.
              </p>
              <h2>What’s under the hood?</h2>
              <p>
                React and Vite power the interface. An Express API handles
                sessions, proxying, and request limits. MongoDB stores accounts
                and activity. The source includes integration tests and local
                development instructions.
              </p>
              <h2>Made in the open.</h2>
              <p>
                Useful tools get better when people use them. Report a rough
                edge, suggest an example, or read the code and build your own
                version.
              </p>
              <ExternalLink className="button button-green" href={GITHUB}>
                Read the source
              </ExternalLink>
            </>
          )}
          {page === "help" && (
            <>
              <p className="prose-lead">
                Start with the status code and response body. They usually tell
                you where the request stopped.
              </p>
              <h2>“API key required” or “Invalid API key”</h2>
              <p>
                Try one of the preset examples without a key, or sign in and
                copy your current key from the dashboard. Rotating a key
                invalidates the previous one immediately. Send your EduCors key
                in <code>x-api-key</code>.
              </p>
              <h2>“Private or reserved address”</h2>
              <p>
                EduCors only reaches public APIs. Localhost, private IPs,
                reserved ranges, and hostnames that resolve to them are blocked.
                Use your own local server when testing a private backend.
              </p>
              <h2>The target redirected or timed out</h2>
              <p>
                Use the API’s final URL directly. Check that it’s available and
                that the response is below 5 MB. The proxy waits up to 15
                seconds for the upstream response.
              </p>
              <h2>Account storage is unavailable</h2>
              <p>
                Public demo presets can still work. For local development, start
                MongoDB and check <code>MONGO_SRV</code> in the backend
                configuration. Hosted instances need a working database
                connection.
              </p>
              <h2>The browser still reports CORS</h2>
              <p>
                Make sure the request uses the EduCors endpoint, rather than
                calling the target directly. When hosting frontend and API
                separately, configure the API URL and allowed frontend origin.
                Check that your hosting platform handles OPTIONS preflight
                requests.
              </p>
              <h2>Getting an upstream 401 or 403?</h2>
              <p>
                The target API may require its own token or refuse access. Add
                its token in <code>Authorization</code> and your EduCors key in{" "}
                <code>x-api-key</code>. A proxy cannot grant permissions the
                target API hasn’t given you.
              </p>
              <Link className="text-link" to="/documentation#errors">
                Browse the response-code reference
                <ArrowRight size={15} />
              </Link>
              <hr />
              <p>
                Still stuck? Share the endpoint, method, and error text in an
                issue. Remove API keys and tokens first.
              </p>
              <ExternalLink className="text-link" href={GITHUB + "/issues"}>
                Open an issue
              </ExternalLink>
            </>
          )}
          {page === "contact" && (
            <>
              <p className="prose-lead">
                Found something broken? Have an idea that would make this more
                useful? I’d like to hear it.
              </p>
              <div className="contact-row">
                <div>
                  <p className="eyebrow">BUGS & FEATURE IDEAS</p>
                  <h2>Leave a trail on GitHub.</h2>
                  <p>
                    Include the request method, the public endpoint, and the
                    error. Keep credentials out of the report.
                  </p>
                </div>
                <ExternalLink
                  className="button button-outline"
                  href={GITHUB + "/issues"}
                >
                  Open an issue
                </ExternalLink>
              </div>
              <div className="contact-row">
                <div>
                  <p className="eyebrow">SAY HELLO</p>
                  <h2>A direct line.</h2>
                  <p>
                    For feedback, collaboration, or questions about this
                    project.
                  </p>
                </div>
                <a className="text-link" href="mailto:bkushwaha.dev@gmail.com">
                  bkushwaha.dev@gmail.com
                  <ArrowUpRight size={15} />
                </a>
              </div>
              <p className="field-help">
                The email link opens your mail app. There is no form collecting
                messages here.
              </p>
            </>
          )}
          {page === "privacy" && (
            <>
              <p className="prose-lead">
                EduCors stores the information it needs to provide accounts,
                keys, and request activity.
              </p>
              <h2>Account information</h2>
              <p>
                Your username, name, email, account timestamps, API key, and
                password hash are stored in MongoDB. Passwords are hashed using
                bcrypt. Your session is held in an HTTP-only cookie that lasts
                up to seven days.
              </p>
              <h2>Request activity</h2>
              <p>
                For authenticated calls, the service records the target origin
                and path, method, response status, latency, and timestamp. Query
                strings, request bodies, response bodies, and upstream tokens
                are not included in this activity record. The dashboard keeps a
                recent list of 30 requests and daily request counts.
              </p>
              <h2>Public demos</h2>
              <p>
                A temporary in-memory record of request timestamps keyed by IP
                enforces the public demo limit. It isn’t added to an account’s
                activity history. Hosting providers may keep their own access
                logs.
              </p>
              <h2>Your requests pass through a server</h2>
              <p>
                The proxy processes the request and response to forward them.
                Avoid sending private information through a public instance
                unless you trust its operator. API credentials you send to a
                target are forwarded to that target, except for the EduCors
                gateway key.
              </p>
              <h2>No advertising trackers</h2>
              <p>
                The application does not include advertising or third-party
                analytics scripts. Fonts are served locally. External links have
                their own privacy policies.
              </p>
              <h2>Questions or account deletion</h2>
              <p>
                Contact{" "}
                <a href="mailto:bkushwaha.dev@gmail.com">
                  bkushwaha.dev@gmail.com
                </a>{" "}
                to ask about your stored information or request account
                deletion.
              </p>
            </>
          )}
          {page === "missing" && (
            <>
              <p className="prose-lead">
                This page isn’t part of the toolkit. Let’s get you somewhere
                useful.
              </p>
              <div className="hero-actions">
                <Link className="button button-green" to="/playground">
                  Open playground
                  <ArrowRight size={16} />
                </Link>
                <Link className="button button-outline" to="/">
                  Back home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
