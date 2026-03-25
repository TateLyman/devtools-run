"use client";
import { useState } from "react";

export default function CSPGenerator() {
  const [directives, setDirectives] = useState({
    "default-src": ["'self'"],
    "script-src": ["'self'"],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "https:"],
    "font-src": ["'self'", "https://fonts.gstatic.com"],
    "connect-src": ["'self'"],
    "frame-src": ["'none'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
  });
  const [copied, setCopied] = useState(false);

  const allDirectives = [
    "default-src", "script-src", "style-src", "img-src", "font-src",
    "connect-src", "frame-src", "media-src", "object-src", "base-uri",
    "form-action", "frame-ancestors", "worker-src", "manifest-src",
  ];

  const commonSources = [
    "'self'", "'none'", "'unsafe-inline'", "'unsafe-eval'",
    "data:", "blob:", "https:", "http:", "*.googleapis.com",
    "*.gstatic.com", "*.google.com", "*.cloudflare.com",
    "*.jsdelivr.net", "*.unpkg.com", "*.cdnjs.cloudflare.com",
    "*.vercel.app", "*.netlify.app",
  ];

  const updateDirective = (name: string, sources: string[]) => {
    setDirectives({ ...directives, [name]: sources });
  };

  const toggleSource = (directive: string, source: string) => {
    const current = directives[directive as keyof typeof directives] || [];
    if (current.includes(source)) {
      updateDirective(directive, current.filter((s) => s !== source));
    } else {
      updateDirective(directive, [...current, source]);
    }
  };

  const csp = Object.entries(directives)
    .filter(([, sources]) => sources.length > 0)
    .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
    .join("; ");

  const metaTag = `<meta http-equiv="Content-Security-Policy" content="${csp}">`;
  const headerValue = `Content-Security-Policy: ${csp}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">CSP Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate Content Security Policy headers. Toggle directives and sources visually. Copy as HTTP header or meta tag.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 max-h-[600px] overflow-auto">
          {allDirectives.map((directive) => {
            const sources = directives[directive as keyof typeof directives] || [];
            return (
              <div key={directive} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3">
                <h3 className="font-bold text-xs text-purple-400 mb-2">{directive}</h3>
                <div className="flex flex-wrap gap-1">
                  {commonSources.map((src) => (
                    <button
                      key={src}
                      onClick={() => toggleSource(directive, src)}
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        sources.includes(src)
                          ? "bg-purple-600 text-white"
                          : "bg-[var(--bg-primary)] text-gray-500 hover:text-white"
                      }`}
                    >
                      {src}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">HTTP Header</label>
              <button onClick={() => { navigator.clipboard.writeText(headerValue); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-purple-400">{copied ? "Copied!" : "Copy"}</button>
            </div>
            <pre className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-3 text-xs font-mono text-emerald-400 whitespace-pre-wrap break-all">{headerValue}</pre>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">Meta Tag</label>
              <button onClick={() => navigator.clipboard.writeText(metaTag)} className="text-xs text-purple-400">Copy</button>
            </div>
            <pre className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-3 text-xs font-mono text-blue-400 whitespace-pre-wrap break-all">{metaTag}</pre>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-xs text-[var(--text-secondary)]">
            <h3 className="font-bold text-white mb-1">What is CSP?</h3>
            <p>Content Security Policy prevents XSS attacks by controlling which resources the browser can load. Add it as an HTTP header or meta tag.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
