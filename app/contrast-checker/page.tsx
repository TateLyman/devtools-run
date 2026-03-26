"use client";
import { useState } from "react";

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function luminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const l1 = luminance(r1, g1, b1);
  const l2 = luminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export default function ContrastChecker() {
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");

  const ratio = contrastRatio(fg, bg);
  const aaLarge = ratio >= 3;
  const aaNormal = ratio >= 4.5;
  const aaaLarge = ratio >= 4.5;
  const aaaNormal = ratio >= 7;

  const swap = () => { const t = fg; setFg(bg); setBg(t); };

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Color Contrast Checker</h1>
        <p className="text-[var(--text-secondary)]">Check WCAG AA and AAA compliance</p>
      </section>

      <div className="rounded-xl p-8 text-center" style={{ backgroundColor: bg, color: fg }}>
        <div className="text-4xl font-bold mb-2">Sample Text</div>
        <div className="text-lg">The quick brown fox jumps over the lazy dog</div>
        <div className="text-sm mt-1">Small text for accessibility testing</div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex items-center gap-4 justify-center flex-wrap">
          <div className="text-center">
            <label className="text-xs text-[var(--text-secondary)] block mb-1">Text Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={fg} onChange={e => setFg(e.target.value)} className="w-12 h-12 rounded cursor-pointer" />
              <input value={fg} onChange={e => setFg(e.target.value)} className="w-24 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono text-sm" />
            </div>
          </div>
          <button onClick={swap} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-full w-10 h-10 flex items-center justify-center hover:bg-[var(--bg-secondary)]">⇄</button>
          <div className="text-center">
            <label className="text-xs text-[var(--text-secondary)] block mb-1">Background</label>
            <div className="flex items-center gap-2">
              <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-12 h-12 rounded cursor-pointer" />
              <input value={bg} onChange={e => setBg(e.target.value)} className="w-24 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono text-sm" />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="text-5xl font-bold" style={{ color: ratio >= 4.5 ? "#22c55e" : ratio >= 3 ? "#eab308" : "#ef4444" }}>
          {ratio.toFixed(2)}:1
        </div>
        <div className="text-sm text-[var(--text-secondary)]">Contrast Ratio</div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {[
          { level: "AA Normal Text", pass: aaNormal, req: "4.5:1" },
          { level: "AA Large Text", pass: aaLarge, req: "3:1" },
          { level: "AAA Normal Text", pass: aaaNormal, req: "7:1" },
          { level: "AAA Large Text", pass: aaaLarge, req: "4.5:1" },
        ].map(c => (
          <div key={c.level} className={`rounded-xl p-4 flex justify-between items-center border ${c.pass ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30"}`}>
            <div>
              <div className="font-bold text-sm">{c.level}</div>
              <div className="text-xs text-[var(--text-secondary)]">Requires {c.req}</div>
            </div>
            <span className={`text-lg font-bold ${c.pass ? "text-emerald-400" : "text-red-400"}`}>{c.pass ? "PASS" : "FAIL"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
