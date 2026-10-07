import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { useApp } from "../context";

export function Logo({ small = false }) {
  return (
    <Link
      className={"brand" + (small ? " brand-small" : "")}
      to="/"
      aria-label="EduCors home"
    >
      <svg
        className="brand-mark"
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden="true"
      >
        <rect width="36" height="36" rx="5" fill="currentColor" />
        <path
          d="M12 10H8v16h4m12-16h4v16h-4M14 18h8m-3-3 3 3-3 3"
          stroke="#f5f4ee"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>
        edu<span className="brand-second">cors</span>
        <span className="brand-dot">.</span>
      </span>
    </Link>
  );
}
export function ExternalLink({ href, children, className = "" }) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
      <ArrowUpRight size={14} aria-hidden="true" />
    </a>
  );
}
export function CopyButton({ text, label = "Copy", className = "" }) {
  const [copied, setCopied] = useState(false);
  const { notify } = useApp();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      notify(
        "Clipboard access is unavailable. Select the text and copy it manually.",
      );
    }
  };
  return (
    <button type="button" className={"copy-button " + className} onClick={copy}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied" : label}
    </button>
  );
}
export function CodeBlock({ code, label = "JavaScript", copy = true }) {
  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>{label}</span>
        {copy && <CopyButton text={code} />}
      </div>
      <pre tabIndex={0} aria-label={label + " code sample"}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
export function PageHeading({ eyebrow, title, children, action }) {
  return (
    <header className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {children && <p className="page-intro">{children}</p>}
      </div>
      {action}
    </header>
  );
}
export function Tabs({ items, value, onChange, label }) {
  const id = label.toLowerCase().replaceAll(" ", "-");
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          id={id + "-" + item.id}
          aria-controls={id + "-panel"}
          aria-selected={value === item.id}
          tabIndex={value === item.id ? 0 : -1}
          onClick={() => onChange(item.id)}
          onKeyDown={(event) => {
            const direction =
              event.key === "ArrowRight"
                ? 1
                : event.key === "ArrowLeft"
                  ? -1
                  : 0;
            if (direction || event.key === "Home" || event.key === "End") {
              event.preventDefault();
              const next =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? items.length - 1
                    : (index + direction + items.length) % items.length;
              onChange(items[next].id);
              event.currentTarget.parentNode.children[next].focus();
            }
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
