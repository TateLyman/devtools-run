"use client";
import { useState } from "react";

export default function WebhookTester() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("POST");
  const [headers, setHeaders] = useState('{"Content-Type": "application/json"}');
  const [body, setBody] = useState('{"event": "test", "data": {"message": "Hello from DevTools.run"}}');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!url.trim()) return;
    setLoading(true);
    const start = Date.now();
    try {
      let parsedHeaders: Record<string, string> = {};
      try { parsedHeaders = JSON.parse(headers); } catch {}

      const options: RequestInit = {
        method,
        headers: parsedHeaders,
        mode: "no-cors",
      };
      if (method !== "GET" && method !== "HEAD" && body.trim()) {
        options.body = body;
      }

      const res = await fetch(url, options);
      const elapsed = Date.now() - start;

      let responseBody = "";
      try { responseBody = await res.text(); } catch { responseBody = "(opaque response — CORS blocked)"; }

      setResponse({
        status: res.status || "opaque",
        statusText: res.statusText || "CORS",
        time: elapsed,
        headers: Object.fromEntries(res.headers.entries()),
        body: responseBody,
      });
    } catch (e: any) {
      setResponse({ error: e.message, time: Date.now() - start });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Webhook Tester</h1>
        <p className="text-[var(--text-secondary)]">
          Send HTTP requests to any URL. Test webhooks, APIs, and endpoints. Supports GET, POST, PUT, PATCH, DELETE.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2.5 text-white text-sm font-bold w-28">
            {["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"].map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <input value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="https://your-webhook-url.com" className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-2.5 text-white font-mono text-sm" />
          <button onClick={send} disabled={loading} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2.5 rounded font-bold">{loading ? "..." : "Send"}</button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Headers (JSON)</label>
            <textarea value={headers} onChange={(e) => setHeaders(e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-20 resize-none font-mono text-xs" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Body</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-20 resize-none font-mono text-xs" />
          </div>
        </div>
      </div>

      {response && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-4 text-sm">
            <span className={`font-bold ${response.error ? "text-red-400" : response.status < 400 ? "text-emerald-400" : "text-red-400"}`}>
              {response.error ? "Error" : `${response.status} ${response.statusText}`}
            </span>
            <span className="text-gray-400">{response.time}ms</span>
          </div>

          {response.error ? (
            <p className="text-red-400 text-sm font-mono">{response.error}</p>
          ) : (
            <>
              {Object.keys(response.headers || {}).length > 0 && (
                <div>
                  <h4 className="text-xs text-gray-400 mb-1">Response Headers</h4>
                  <div className="text-xs font-mono space-y-0.5">
                    {Object.entries(response.headers).map(([k, v]) => (
                      <div key={k}><span className="text-purple-400">{k}:</span> <span className="text-white">{v as string}</span></div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h4 className="text-xs text-gray-400 mb-1">Response Body</h4>
                <pre className="text-xs font-mono text-emerald-400 max-h-48 overflow-auto whitespace-pre-wrap">{response.body || "(empty)"}</pre>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
