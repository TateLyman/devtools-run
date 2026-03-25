"use client";
import { useState } from "react";

export default function CurlBuilderPage() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://api.example.com/data");
  const [headers, setHeaders] = useState("Content-Type: application/json");
  const [body, setBody] = useState('{"key": "value"}');
  const [copied, setCopied] = useState(false);

  const cmd = [
    `curl -X ${method}`,
    `"${url}"`,
    ...headers.split("\n").filter(h => h.trim()).map(h => `-H "${h.trim()}"`),
    method !== "GET" && body.trim() ? `-d '${body.trim()}'` : "",
  ].filter(Boolean).join(" \\\n  ");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">cURL Command Builder</h1>
        <p className="text-gray-400 text-center mb-8">Build cURL commands visually. Copy and paste into your terminal.</p>
        <div className="bg-gray-900 rounded-xl p-6 mb-6 space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {["GET","POST","PUT","DELETE"].map(m => (
              <button key={m} onClick={() => setMethod(m)}
                className={`py-2 rounded-lg font-bold text-sm ${method === m ? "bg-purple-600" : "bg-gray-700 hover:bg-gray-600"}`}>{m}</button>
            ))}
          </div>
          <div>
            <label className="text-xs text-gray-400">URL</label>
            <input type="text" value={url} onChange={e => setUrl(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white font-mono text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Headers (one per line)</label>
            <textarea value={headers} onChange={e => setHeaders(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white font-mono text-sm h-16 resize-none" />
          </div>
          {method !== "GET" && (
            <div>
              <label className="text-xs text-gray-400">Body</label>
              <textarea value={body} onChange={e => setBody(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white font-mono text-sm h-20 resize-none" />
            </div>
          )}
        </div>
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-gray-400">Generated Command</span>
            <button onClick={() => {navigator.clipboard.writeText(cmd);setCopied(true);setTimeout(()=>setCopied(false),2000);}}
              className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-xs font-bold">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <pre className="bg-gray-800 rounded-lg p-4 text-sm text-green-400 font-mono whitespace-pre-wrap overflow-x-auto">{cmd}</pre>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>{" | "}
          <a href="/http-status" className="text-purple-400 hover:underline">HTTP Codes</a>{" | "}
          <a href="/base64" className="text-purple-400 hover:underline">Base64</a>{" | "}
          <a href="/jwt" className="text-purple-400 hover:underline">JWT</a>{" | "}
          <a href="/regex" className="text-purple-400 hover:underline">Regex</a>
        </div>
      </div>
    </div>
  );
}
