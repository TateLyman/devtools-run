"use client";
import { useState } from "react";
const PRESETS = [
  { name: "iPhone SE", w: 375, h: 667 },
  { name: "iPhone 14", w: 390, h: 844 },
  { name: "iPhone 15 Pro Max", w: 430, h: 932 },
  { name: "iPad Mini", w: 768, h: 1024 },
  { name: "iPad Pro", w: 1024, h: 1366 },
  { name: "Laptop", w: 1366, h: 768 },
  { name: "Desktop", w: 1920, h: 1080 },
  { name: "4K", w: 3840, h: 2160 },
];
export default function ResponsiveTest() {
  const [url, setUrl] = useState("https://devtools-site-delta.vercel.app");
  const [width, setWidth] = useState(390);
  const [height, setHeight] = useState(844);
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="space-y-4">
      <section className="text-center"><h1 className="text-4xl font-bold mb-1">Responsive Tester</h1><p className="text-sm text-[var(--text-secondary)]">Preview any URL at different screen sizes</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-3 flex gap-2">
        <input value={url} onChange={e => setUrl(e.target.value)} className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-sm" placeholder="https://example.com" />
        <button onClick={() => setLoaded(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold">Load</button>
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        {PRESETS.map(p => (<button key={p.name} onClick={() => { setWidth(p.w); setHeight(p.h); }} className={`px-2 py-1 rounded text-xs ${width === p.w && height === p.h ? "bg-blue-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>{p.name} ({p.w}x{p.h})</button>))}
      </div>
      <div className="flex gap-2 justify-center items-center text-sm">
        <input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} className="w-20 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono text-center" />
        <span>x</span>
        <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-20 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono text-center" />
      </div>
      {loaded && (
        <div className="flex justify-center overflow-auto">
          <div className="border-2 border-[var(--border)] rounded-xl overflow-hidden bg-white" style={{ width: Math.min(width, 1200), height: Math.min(height, 700) }}>
            <iframe src={url} style={{ width, height, transform: width > 1200 ? `scale(${1200/width})` : "none", transformOrigin: "top left" }} className="border-0" />
          </div>
        </div>
      )}
    </div>
  );
}
