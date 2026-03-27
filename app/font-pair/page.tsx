"use client";
import { useState } from "react";
const PAIRS = [
  { heading: "Playfair Display", body: "Source Sans Pro", style: "Elegant" },
  { heading: "Montserrat", body: "Open Sans", style: "Modern" },
  { heading: "Roboto Slab", body: "Roboto", style: "Clean" },
  { heading: "Lora", body: "Merriweather", style: "Literary" },
  { heading: "Oswald", body: "Quattrocento", style: "Bold" },
  { heading: "Poppins", body: "Inter", style: "Minimal" },
  { heading: "DM Serif Display", body: "DM Sans", style: "Sophisticated" },
  { heading: "Space Grotesk", body: "Space Mono", style: "Tech" },
  { heading: "Bitter", body: "Raleway", style: "Warm" },
  { heading: "Crimson Pro", body: "Work Sans", style: "Editorial" },
];
export default function FontPair() {
  const [idx, setIdx] = useState(0);
  const [headSize, setHeadSize] = useState(48);
  const [bodySize, setBodySize] = useState(16);
  const pair = PAIRS[idx];
  const cssImport = `@import url('https://fonts.googleapis.com/css2?family=${pair.heading.replace(/ /g,"+")}:wght@700&family=${pair.body.replace(/ /g,"+")}:wght@400;700&display=swap');`;
  const css = `${cssImport}\n\nh1, h2, h3 {\n  font-family: '${pair.heading}', serif;\n  font-size: ${headSize}px;\n}\n\nbody, p {\n  font-family: '${pair.body}', sans-serif;\n  font-size: ${bodySize}px;\n}`;
  return (
    <div className="space-y-6">
      <link href={`https://fonts.googleapis.com/css2?family=${pair.heading.replace(/ /g,"+")}:wght@700&family=${pair.body.replace(/ /g,"+")}:wght@400;700&display=swap`} rel="stylesheet" />
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Font Pairing</h1><p className="text-[var(--text-secondary)]">Find the perfect heading + body combination</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8">
        <h2 style={{ fontFamily: `'${pair.heading}', serif`, fontSize: `${headSize}px`, lineHeight: 1.2, marginBottom: 16 }}>The Quick Brown Fox</h2>
        <p style={{ fontFamily: `'${pair.body}', sans-serif`, fontSize: `${bodySize}px`, lineHeight: 1.6, color: "var(--text-secondary)" }}>Jumps over the lazy dog. This is body text using {pair.body}. The heading above uses {pair.heading}. Together they create a {pair.style.toLowerCase()} feel that works well for web design.</p>
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        {PAIRS.map((p, i) => (<button key={i} onClick={()=>setIdx(i)} className={`px-3 py-1 rounded text-xs ${idx===i ? "bg-blue-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>{p.style}</button>))}
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 grid gap-3 md:grid-cols-2">
        <div><label className="text-xs text-[var(--text-secondary)]">Heading: {headSize}px — {pair.heading}</label><input type="range" min={24} max={80} value={headSize} onChange={e=>setHeadSize(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Body: {bodySize}px — {pair.body}</label><input type="range" min={12} max={24} value={bodySize} onChange={e=>setBodySize(Number(e.target.value))} className="w-full" /></div>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">CSS</label><button onClick={()=>navigator.clipboard.writeText(css)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button></div><pre className="font-mono text-xs text-emerald-400 whitespace-pre-wrap">{css}</pre></div>
    </div>
  );
}
