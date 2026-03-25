"use client";
import { useState } from "react";

export default function ApiTesterPage() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://devtools-site-delta.vercel.app/api/random?type=quote");
  const [headers, setHeaders] = useState("Content-Type: application/json");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(0);

  async function send() {
    setLoading(true);
    const start = Date.now();
    try {
      const opts: RequestInit = { method };
      const hdrs: Record<string,string> = {};
      headers.split("\n").forEach(h => { const [k,...v] = h.split(":"); if(k.trim()) hdrs[k.trim()] = v.join(":").trim(); });
      opts.headers = hdrs;
      if (method !== "GET" && body) opts.body = body;
      const res = await fetch(url, opts);
      const text = await res.text();
      setTime(Date.now() - start);
      let parsed;
      try { parsed = JSON.parse(text); } catch { parsed = text; }
      setResponse({ status: res.status, statusText: res.statusText, body: typeof parsed === "object" ? JSON.stringify(parsed, null, 2) : parsed, headers: Object.fromEntries(res.headers) });
    } catch (e: any) {
      setTime(Date.now() - start);
      setResponse({ status: 0, statusText: "Error", body: e.message });
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">API Tester</h1>
        <p className="text-gray-400 text-center mb-8">Send HTTP requests from your browser. Like Postman, but free.</p>
        <div className="bg-gray-900 rounded-xl p-6 mb-4">
          <div className="flex gap-2 mb-3">
            {["GET","POST","PUT","DELETE","PATCH"].map(m=><button key={m} onClick={()=>setMethod(m)} className={`px-3 py-1 rounded text-xs font-bold ${method===m?"bg-purple-600":"bg-gray-800 hover:bg-gray-700"}`}>{m}</button>)}
          </div>
          <div className="flex gap-2 mb-3">
            <input type="text" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://api.example.com/data" className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono text-sm" />
            <button onClick={send} disabled={loading} className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-bold disabled:opacity-50">{loading?"...":"Send"}</button>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-400">Headers</label><textarea value={headers} onChange={e=>setHeaders(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono text-xs h-16 resize-none" /></div>
            {method!=="GET"&&<div><label className="text-xs text-gray-400">Body</label><textarea value={body} onChange={e=>setBody(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono text-xs h-16 resize-none" /></div>}
          </div>
        </div>
        {response && (
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-sm font-bold ${response.status<300?"text-green-400":response.status<400?"text-blue-400":response.status<500?"text-yellow-400":"text-red-400"}`}>{response.status} {response.statusText}</span>
              <span className="text-xs text-gray-500">{time}ms</span>
            </div>
            <pre className="bg-gray-800 rounded-lg p-4 text-xs text-green-400 font-mono overflow-x-auto max-h-80 whitespace-pre-wrap">{response.body}</pre>
          </div>
        )}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/curl-builder" className="text-purple-400 hover:underline">cURL Builder</a>{" | "}
          <a href="/json" className="text-purple-400 hover:underline">JSON Formatter</a>{" | "}
          <a href="/api-docs" className="text-purple-400 hover:underline">Our APIs</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
