import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Eye, EyeOff, KeyRound } from "lucide-react";
import { useApp } from "../context";
import { api } from "../lib/api";

export default function Auth({ mode }) {
  const signup = mode === "signup";
  const { user, setUser, notify } = useApp();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    Name: "",
    UserName: "",
    Email: "",
    Password: "",
    UserNameorEmail: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (user) navigate("/profile", { replace: true });
  }, [user, navigate]);
  useEffect(() => {
    setError("");
  }, [mode]);
  const field = (name, label, props = {}) => (
    <div className="form-field">
      <label htmlFor={"auth-" + name}>{label}</label>
      <input
        id={"auth-" + name}
        name={name}
        required
        value={values[name]}
        onChange={(event) =>
          setValues({ ...values, [name]: event.target.value })
        }
        {...props}
      />
    </div>
  );
  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const payload = signup
        ? {
            Name: values.Name,
            UserName: values.UserName,
            Email: values.Email,
            Password: values.Password,
          }
        : {
            UserNameorEmail: values.UserNameorEmail,
            Password: values.Password,
          };
      const result = await api(signup ? "/signUp" : "/signIn", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setUser(result.data);
      notify(
        signup ? "Account created. Your API key is ready." : "Welcome back.",
      );
      navigate("/profile");
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="shell auth-page">
      <aside className="auth-story">
        <p className="eyebrow">YOUR NEXT INTEGRATION STARTS HERE</p>
        <h1>
          {signup ? (
            <>
              Less friction.
              <br /> More possibility.
            </>
          ) : (
            <>
              Back to
              <br /> building.
            </>
          )}
        </h1>
        <p>
          A personal API key, a useful playground, and a clear picture of your
          requests.
        </p>
        <div className="auth-benefits">
          <div>
            <Check size={16} />
            Custom public API endpoints
          </div>
          <div>
            <Check size={16} />
            120 requests per minute per key
          </div>
          <div>
            <Check size={16} />
            Your own recent request activity
          </div>
        </div>
        <div className="auth-margin-note">
          <KeyRound size={22} />
          <span>
            A key is generated as soon as
            <br /> you create your account.
          </span>
        </div>
      </aside>
      <div className="auth-form-panel">
        <p className="eyebrow">
          {signup ? "CREATE YOUR ACCOUNT" : "WELCOME BACK"}
        </p>
        <h2>{signup ? "Make yourself at home." : "Sign in to EduCors."}</h2>
        <p>
          {signup
            ? "Free to use. No credit card, no setup maze."
            : "Your API key and request history are waiting."}
        </p>
        <form onSubmit={submit}>
          {signup ? (
            <>
              {field("Name", "Full name", {
                autoComplete: "name",
                minLength: 2,
                maxLength: 80,
                placeholder: "Your name",
              })}
              {field("UserName", "Username", {
                autoComplete: "username",
                minLength: 3,
                maxLength: 20,
                pattern: "[a-zA-Z0-9_]{3,20}",
                "aria-describedby": "username-help",
                placeholder: "your_handle",
              })}
              <p id="username-help" className="field-help">
                3–20 letters, numbers, or underscores.
              </p>
              {field("Email", "Email address", {
                type: "email",
                autoComplete: "email",
                maxLength: 254,
                placeholder: "you@example.com",
              })}
            </>
          ) : (
            field("UserNameorEmail", "Username or email", {
              autoComplete: "username",
              placeholder: "you@example.com",
            })
          )}
          <div className="form-field">
            <label htmlFor="auth-Password">Password</label>
            <div className="password-field">
              <input
                id="auth-Password"
                name="Password"
                type={showPassword ? "text" : "password"}
                required
                minLength={signup ? 8 : undefined}
                autoComplete={signup ? "new-password" : "current-password"}
                value={values.Password}
                onChange={(event) =>
                  setValues({ ...values, Password: event.target.value })
                }
                aria-describedby={signup ? "password-help" : undefined}
              />
              <button
                className="icon-button"
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {signup && (
            <p className="field-help" id="password-help">
              At least 8 characters. A unique passphrase works well.
            </p>
          )}
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
          <button className="button button-green auth-submit" disabled={busy}>
            {busy ? <span className="spinner" /> : <ArrowRight size={16} />}
            {busy
              ? "One moment…"
              : signup
                ? "Create account & get key"
                : "Sign in"}
          </button>
        </form>
        <p className="auth-switch">
          {signup ? "Already have an account?" : "New around here?"}{" "}
          <Link to={signup ? "/signIn" : "/signUp"}>
            {signup ? "Sign in" : "Create an account"}
            <ArrowRight size={13} />
          </Link>
        </p>
        <p className="auth-privacy">
          By using EduCors, you agree to use it for permitted requests.{" "}
          <Link to="/privacy">Read the privacy note.</Link>
        </p>
      </div>
    </div>
  );
}
