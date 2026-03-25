"use client";
import { useState } from "react";

export default function PlaceholderPage() {
  const [w, setW] = useState("400");
  const [h, setH] = useState("300");
  const [bg, setBg] = useState("333");
  const [fg, setFg] = useState("aaa");
  const [text, setText] = useState("");

  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/api/placeholder?w=${w}&h=${h}&bg=${bg}&fg=${fg}${text ? `&text=${encodeURIComponent(text)}` : ""}`;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Placeholder Image Generator</h1>
        <p className="text-gray-400 text-center mb-8">Generate placeholder images via URL. Use in HTML, Markdown, or any project.</p>
        <div className="flex justify-center mb-6">
          <img src={`/api/placeholder?w=${w}&h=${h}&bg=${bg}&fg=${fg}${text ? `&text=${encodeURIComponent(text)}` : ""}`}
            alt="placeholder" className="rounded-lg border border-gray-700" style={{maxWidth:"100%"}} />
        </div>
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            <div><label className="text-xs text-gray-400">Width</label><input type="number" value={w} onChange={e=>setW(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm" /></div>
            <div><label className="text-xs text-gray-400">Height</label><input type="number" value={h} onChange={e=>setH(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm" /></div>
            <div><label className="text-xs text-gray-400">BG (hex)</label><input type="text" value={bg} onChange={e=>setBg(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm font-mono" /></div>
            <div><label className="text-xs text-gray-400">Text Color</label><input type="text" value={fg} onChange={e=>setFg(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm font-mono" /></div>
            <div><label className="text-xs text-gray-400">Custom Text</label><input type="text" value={text} onChange={e=>setText(e.target.value)} placeholder="optional" className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm" /></div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Image URL (use anywhere)</div>
            <code className="text-xs text-green-400 break-all cursor-pointer" onClick={()=>navigator.clipboard.writeText(url)}>{url}</code>
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <h2 className="font-bold mb-3">API Usage</h2>
          <pre className="bg-gray-800 rounded-lg p-4 text-xs text-green-300 overflow-x-auto">{`<img src="/api/placeholder?w=800&h=400&bg=1a1a2e&fg=6c5ce7&text=Hero+Image" />

Params: w (width), h (height), bg (hex no #), fg (text hex), text (custom label)
Returns: SVG image. Works in <img>, CSS, Markdown, anywhere.`}</pre>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/favicon" className="text-purple-400 hover:underline">Favicon</a>{" | "}
          <a href="/gradient" className="text-purple-400 hover:underline">Gradients</a>{" | "}
          <a href="/qr" className="text-purple-400 hover:underline">QR Code</a>{" | "}
          <a href="/color" className="text-purple-400 hover:underline">Colors</a>{" | "}
          <a href="/meta-tags" className="text-purple-400 hover:underline">Meta Tags</a>
        </div>
      </div>
    </div>
  );
}
