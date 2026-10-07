import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo, ExternalLink } from "./UI";
import { useApp } from "../context";
import { GITHUB } from "../lib/api";

export function Header() {
  const { user, health } = useApp();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        document.querySelector(".menu-toggle")?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Logo />
        <nav
          id="main-navigation"
          className={"main-nav" + (open ? " is-open" : "")}
          aria-label="Main navigation"
        >
          <Link to="/#use-the-proxy">Use the proxy</Link>
          <NavLink to="/documentation">Documentation</NavLink>
          <NavLink to="/playground">Playground</NavLink>
          <NavLink to="/about">About the project</NavLink>
          <Link className="mobile-account" to={user ? "/profile" : "/signIn"}>
            {user ? "Dashboard" : "Sign in"}
            <ArrowRight size={14} />
          </Link>
        </nav>
        <div className="header-actions">
          <span className="service-state">
            <span
              className={
                "status-dot " +
                (health?.status === "healthy"
                  ? "online"
                  : health?.status === "offline"
                    ? "offline"
                    : "")
              }
            />
            {health
              ? health.status === "healthy"
                ? "API online"
                : "API unavailable"
              : "Checking API"}
          </span>
          <Link
            className="button button-small button-dark desktop-account"
            to={user ? "/profile" : "/signIn"}
          >
            {user ? "Dashboard" : "Sign in"}
            <ArrowRight size={14} />
          </Link>
          <button
            className="menu-toggle icon-button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-top">
          <div>
            <Logo small />
            <p>
              A CORS proxy for frontend applications.
              <br /> Route API requests through EduCors.
            </p>
          </div>
          <div className="footer-links">
            <div>
              <span className="eyebrow">The toolkit</span>
              <Link to="/playground">Playground</Link>
              <Link to="/documentation">API reference</Link>
              <Link to="/help">Troubleshooting</Link>
            </div>
            <div>
              <span className="eyebrow">The project</span>
              <ExternalLink href={GITHUB}>Source on GitHub</ExternalLink>
              <Link to="/contact">Contact & feedback</Link>
              <Link to="/privacy">Privacy</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            Designed & built by{" "}
            <a href="https://brijeshhq.com" target="_blank" rel="noreferrer">
              Brijesh Kushwaha
            </a>
          </span>
          <span className="mono">OPEN SOURCE / BUILT TO BE USEFUL</span>
        </div>
      </div>
    </footer>
  );
}
export function RouteEffects() {
  const location = useLocation();
  useEffect(() => {
    const names = {
      "/": "Bypass CORS with a proxy",
      "/playground": "Request playground",
      "/documentation": "API documentation",
      "/profile": "Your dashboard",
      "/dashboard": "Your dashboard",
      "/signIn": "Sign in",
      "/signUp": "Create an account",
      "/about": "About the project",
      "/privacy": "Privacy",
      "/contact": "Contact",
      "/help": "Troubleshooting",
    };
    document.title =
      "EduCors — " + (names[location.pathname] || "Page not found");
    if (!location.hash) window.scrollTo(0, 0);
    else
      requestAnimationFrame(() =>
        document.getElementById(location.hash.slice(1))?.scrollIntoView(),
      );
  }, [location]);
  return null;
}
