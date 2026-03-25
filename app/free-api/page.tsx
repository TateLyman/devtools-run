"use client";
import { useState } from "react";

const apis = [
  {
    name: "Random Developer Quote",
    endpoint: "/api/random-quote",
    description: "Get a random programming/developer quote with author attribution.",
    example: '{ "text": "Talk is cheap. Show me the code.", "author": "Linus Torvalds" }',
    method: "GET",
  },
  {
    name: "Random Developer Joke",
    endpoint: "/api/random-joke",
    description: "Get a random programming joke with setup and punchline.",
    example: '{ "setup": "Why do programmers prefer dark mode?", "punchline": "Because light attracts bugs." }',
    method: "GET",
  },
  {
    name: "Random Password",
    endpoint: "/api/random-password",
    description: "Generate a cryptographically secure random password. Optional ?length=N&symbols=true parameters.",
    example: '{ "password": "kR8#mPq2!xLn9Fv4" }',
    method: "GET",
  },
  {
    name: "Random Placeholder Image",
    endpoint: "/api/placeholder",
    description: "Generate placeholder images. Use /api/placeholder?w=400&h=300&text=Hello for custom dimensions and text.",
    example: "Returns an SVG image",
    method: "GET",
  },
];

export default function FreeAPI() {
  const [results, setResults] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const tryAPI = async (endpoint: string) => {
    setLoading({ ...loading, [endpoint]: true });
    try {
      const res = await fetch(endpoint);
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("json")) {
        const data = await res.json();
        setResults({ ...results, [endpoint]: JSON.stringify(data, null, 2) });
      } else {
        setResults({ ...results, [endpoint]: `Status: ${res.status} OK (non-JSON response)` });
      }
    } catch (e: any) {
      setResults({ ...results, [endpoint]: `Error: ${e.message}` });
    }
    setLoading({ ...loading, [endpoint]: false });
  };

  const baseUrl = "https://devtools-site-delta.vercel.app";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Free Public APIs</h1>
        <p className="text-[var(--text-secondary)]">
          Free, no-auth public APIs for developers. Use them in your projects, demos, and hackathons. CORS-enabled, no rate limiting.
        </p>
      </div>

      <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-4 text-sm">
        <p className="text-purple-300">
          Base URL: <code className="text-white bg-[var(--bg-primary)] px-2 py-0.5 rounded font-mono">{baseUrl}</code>
        </p>
        <p className="text-gray-400 mt-1">All APIs return JSON with CORS headers. No authentication required.</p>
      </div>

      <div className="space-y-4">
        {apis.map((api) => (
          <div key={api.endpoint} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-white">{api.name}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{api.description}</p>
              </div>
              <span className="text-xs bg-emerald-600/20 text-emerald-400 px-2 py-0.5 rounded font-mono">{api.method}</span>
            </div>

            <div className="bg-[var(--bg-primary)] rounded px-3 py-2 flex items-center justify-between">
              <code className="text-sm font-mono text-emerald-400">{baseUrl}{api.endpoint}</code>
              <button
                onClick={() => { navigator.clipboard.writeText(`${baseUrl}${api.endpoint}`); }}
                className="text-xs text-purple-400 hover:text-purple-300 ml-2"
              >
                Copy
              </button>
            </div>

            <div className="flex gap-2 items-start">
              <button
                onClick={() => tryAPI(api.endpoint)}
                disabled={loading[api.endpoint]}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-3 py-1.5 rounded text-sm font-bold whitespace-nowrap"
              >
                {loading[api.endpoint] ? "Loading..." : "Try it"}
              </button>
              {results[api.endpoint] && (
                <pre className="flex-1 bg-[var(--bg-primary)] rounded p-2 text-xs font-mono text-white overflow-auto max-h-32">{results[api.endpoint]}</pre>
              )}
            </div>

            <details className="text-xs">
              <summary className="text-gray-400 cursor-pointer">Example response</summary>
              <pre className="mt-1 bg-[var(--bg-primary)] rounded p-2 font-mono text-gray-300">{api.example}</pre>
            </details>

            <div className="text-xs text-gray-500">
              <code>curl {baseUrl}{api.endpoint}</code>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-sm">
        <h3 className="font-bold text-white mb-2">Usage Examples</h3>
        <pre className="bg-[var(--bg-primary)] rounded p-3 text-xs font-mono text-emerald-400 overflow-auto">{`// JavaScript
const res = await fetch("${baseUrl}/api/random-quote");
const quote = await res.json();
console.log(quote.text); // "Talk is cheap. Show me the code."

// Python
import requests
quote = requests.get("${baseUrl}/api/random-quote").json()
print(quote["text"])

// curl
curl ${baseUrl}/api/random-quote`}</pre>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-sm text-[var(--text-secondary)]">
        <p>Need more powerful APIs? Check out our <a href="/api-access" className="text-purple-400 hover:text-purple-300">Paid API Access</a> for token scanning, wallet analysis, and trading endpoints.</p>
      </div>
    </div>
  );
}
