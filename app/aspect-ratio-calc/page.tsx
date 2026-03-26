"use client";
import { useState } from "react";

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }

export default function AspectRatioCalc() {
  const [w, setW] = useState(1920);
  const [h, setH] = useState(1080);
  const [newW, setNewW] = useState("");
  const [newH, setNewH] = useState("");

  const g = gcd(w, h);
  const ratioW = w / g;
  const ratioH = h / g;

  const calcH = newW ? Math.round(Number(newW) * h / w) : "";
  const calcW = newH ? Math.round(Number(newH) * w / h) : "";

  const presets = [
    { name: "16:9", w: 16, h: 9 }, { name: "4:3", w: 4, h: 3 }, { name: "1:1", w: 1, h: 1 },
    { name: "21:9", w: 21, h: 9 }, { name: "3:2", w: 3, h: 2 }, { name: "9:16", w: 9, h: 16 },
    { name: "2:1", w: 2, h: 1 }, { name: "5:4", w: 5, h: 4 },
  ];

  const sizes = [
    ["1920×1080", 1920, 1080], ["1280×720", 1280, 720], ["3840×2160", 3840, 2160],
    ["2560×1440", 2560, 1440], ["1080×1920", 1080, 1920], ["1080×1080", 1080, 1080],
    ["800×600", 800, 600], ["1024×768", 1024, 768],
  ];

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Aspect Ratio Calculator</h1>
        <p className="text-[var(--text-secondary)]">Calculate and scale aspect ratios</p>
      </section>

      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-8 text-center">
        <div className="text-5xl font-bold text-blue-400">{ratioW}:{ratioH}</div>
        <div className="text-sm text-[var(--text-secondary)] mt-1">{w} × {h} pixels</div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="text-sm text-[var(--text-secondary)] block mb-1">Width</label><input type="number" value={w} onChange={e => setW(Number(e.target.value))} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono" /></div>
          <div><label className="text-sm text-[var(--text-secondary)] block mb-1">Height</label><input type="number" value={h} onChange={e => setH(Number(e.target.value))} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono" /></div>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold mb-3">Scale to New Size</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-[var(--text-secondary)] block mb-1">New Width → Height</label>
            <div className="flex gap-2 items-center">
              <input type="number" value={newW} onChange={e => setNewW(e.target.value)} placeholder="Width" className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 font-mono text-sm" />
              <span className="text-[var(--text-secondary)]">→</span>
              <span className="font-mono font-bold text-emerald-400">{calcH || "?"}</span>
            </div>
          </div>
          <div>
            <label className="text-sm text-[var(--text-secondary)] block mb-1">New Height → Width</label>
            <div className="flex gap-2 items-center">
              <input type="number" value={newH} onChange={e => setNewH(e.target.value)} placeholder="Height" className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 font-mono text-sm" />
              <span className="text-[var(--text-secondary)]">→</span>
              <span className="font-mono font-bold text-emerald-400">{calcW || "?"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {presets.map(p => (
          <button key={p.name} onClick={() => { setW(p.w * 100); setH(p.h * 100); }}
            className={`px-3 py-1.5 rounded-lg text-sm border ${ratioW === p.w && ratioH === p.h ? "bg-blue-600 border-blue-500 text-white" : "border-[var(--border)] hover:bg-[var(--bg-secondary)]"}`}>{p.name}</button>
        ))}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-3">Common Resolutions</h2>
        <div className="grid gap-2 md:grid-cols-2">
          {sizes.map(([name, sw, sh]) => (
            <button key={name as string} onClick={() => { setW(sw as number); setH(sh as number); }}
              className="flex justify-between bg-[var(--bg-primary)] rounded-lg px-4 py-2 text-sm hover:border-blue-500/50 border border-transparent">
              <span className="font-mono">{name as string}</span>
              <span className="text-[var(--text-secondary)]">{(sw as number) / gcd(sw as number, sh as number)}:{(sh as number) / gcd(sw as number, sh as number)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
