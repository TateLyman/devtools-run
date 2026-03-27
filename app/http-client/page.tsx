"use client";
import { useState } from "react";
export default function HttpClient() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
  const [headers, setHeaders] = useState('{"Content-Type": "application/json"}');
  const [body, setBody] = useState("");
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState(0);
  const [time, setTime] = useState(0);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const opts: RequestInit = { method, headers: JSON.parse(headers || "{}") };
      if (["POST","PUT","PATCH"].includes(method) && body) opts.body = body;
      const res = await fetch(url, opts);
      setStatus(res.status);
      const text = await res.text();
      try { setResponse(JSON.stringify(JSON.parse(text), null, 2)); } catch { setResponse(text); }
    } catch (e) { setResponse(`Error: ${(e as Error).message}`); setStatus(0); }
    setTime(Math.round(performance.now() - start));
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <section className="text-center"><h1 className="text-4xl font-bold mb-1">HTTP Client</h1><p className="text-sm text-[var(--text-secondary)]">Test API endpoints from your browser</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex gap-2">
          <select value={method} onChange={e=>setMethod(e.target.value)} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-bold text-sm">
            {["GET","POST","PUT","PATCH","DELETE","HEAD","OPTIONS"].map(m=><option key={m}>{m}</option>)}
          </select>
          <input value={url} onChange={e=>setUrl(e.target.value)} className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-sm" placeholder="https://api.example.com/endpoint" />
          <button onClick={send} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold">{loading ? "..." : "Send"}</button>
        </div>
        <details className="mt-3"><summary className="text-sm text-[var(--text-secondary)] cursor-pointer">Headers & Body</summary>
          <div className="mt-2 space-y-2">
            <textarea value={headers} onChange={e=>setHeaders(e.target.value)} rows={2} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-2 font-mono text-xs resize-none" placeholder='{"Authorization": "Bearer ..."}' />
            {["POST","PUT","PATCH"].includes(method) && <textarea value={body} onChange={e=>setBody(e.target.value)} rows={3} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-2 font-mono text-xs resize-none" placeholder='{"key": "value"}' />}
          </div>
        </details>
      </div>
      {(response || status > 0) && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <div className="flex gap-3 text-sm">
              <span className={`font-bold ${status >= 200 && status < 300 ? "text-emerald-400" : status >= 400 ? "text-red-400" : "text-yellow-400"}`}>Status: {status}</span>
              <span className="text-[var(--text-secondary)]">{time}ms</span>
            </div>
            <button onClick={()=>navigator.clipboard.writeText(response)} className="text-xs text-blue-400">Copy</button>
          </div>
          <pre className="font-mono text-xs text-emerald-400 whitespace-pre-wrap max-h-[400px] overflow-auto">{response}</pre>
        </div>
      )}
    </div>
  );
}
