"use client";
import { useState, useRef } from "react";

export default function PlaygroundPage() {
  const [html, setHtml] = useState('<h1 style="color:#6c5ce7">Hello World</h1>\n<p>Edit the code and see live results.</p>\n<button onclick="alert(\'clicked!\')">Click me</button>');
  const [css, setCss] = useState("body {\n  font-family: sans-serif;\n  padding: 20px;\n  background: #1a1a2e;\n  color: white;\n}");
  const [js, setJs] = useState('console.log("Hello from the playground!");');
  const [tab, setTab] = useState<"html"|"css"|"js">("html");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const srcDoc = `<html><head><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold mb-4 text-center">Code Playground</h1>
        <div className="grid md:grid-cols-2 gap-4" style={{height:"70vh"}}>
          <div className="flex flex-col">
            <div className="flex gap-1 mb-2">
              {(["html","css","js"] as const).map(t=>(
                <button key={t} onClick={()=>setTab(t)} className={`px-4 py-1 rounded-t text-sm font-bold ${tab===t?"bg-gray-800 text-purple-400":"bg-gray-900 text-gray-500"}`}>{t.toUpperCase()}</button>
              ))}
            </div>
            <textarea value={tab==="html"?html:tab==="css"?css:js} onChange={e=>{tab==="html"?setHtml(e.target.value):tab==="css"?setCss(e.target.value):setJs(e.target.value);}}
              className="flex-1 bg-gray-900 border border-gray-700 rounded-b-xl px-4 py-3 text-green-400 font-mono text-sm resize-none" />
          </div>
          <div className="bg-white rounded-xl overflow-hidden">
            <iframe ref={iframeRef} srcDoc={srcDoc} className="w-full h-full border-0" sandbox="allow-scripts" />
          </div>
        </div>
        <div className="mt-4 text-center text-gray-500 text-sm">
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>{" | "}
          <a href="/regex" className="text-purple-400 hover:underline">Regex</a>{" | "}
          <a href="/css-minify" className="text-purple-400 hover:underline">CSS Minify</a>{" | "}
          <a href="/snippets/javascript-snippets" className="text-purple-400 hover:underline">Snippets</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
