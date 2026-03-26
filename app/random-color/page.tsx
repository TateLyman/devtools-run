"use client";
import { useState } from "react";

function randomHex(): string {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function RandomColor() {
  const [colors, setColors] = useState<{ hex: string; locked: boolean }[]>(
    Array.from({ length: 5 }, () => ({ hex: randomHex(), locked: false }))
  );
  const [history, setHistory] = useState<string[]>([]);

  const generate = () => {
    setColors(colors.map(c => c.locked ? c : { hex: randomHex(), locked: false }));
  };

  const lock = (i: number) => {
    const c = [...colors]; c[i].locked = !c[i].locked; setColors(c);
  };

  const copy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setHistory(prev => [hex, ...prev.filter(h => h !== hex)].slice(0, 20));
  };

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Random Color Generator</h1>
        <p className="text-[var(--text-secondary)]">Press spacebar or click Generate for new colors</p>
      </section>

      <div className="flex gap-1 rounded-xl overflow-hidden h-48 md:h-64" onKeyDown={e => e.key === " " && generate()} tabIndex={0}>
        {colors.map((c, i) => (
          <div key={i} className="flex-1 relative group cursor-pointer" style={{ backgroundColor: c.hex }} onClick={() => copy(c.hex)}>
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
              <div className="font-mono text-white text-sm font-bold">{c.hex.toUpperCase()}</div>
              <div className="text-white/70 text-xs">{hexToRgb(c.hex)}</div>
              <button onClick={e => { e.stopPropagation(); lock(i); }} className="mt-2 text-white text-lg">{c.locked ? "🔒" : "🔓"}</button>
            </div>
            {c.locked && <div className="absolute top-2 right-2 text-lg">🔒</div>}
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button onClick={generate} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-lg">Generate Colors</button>
      </div>

      {history.length > 0 && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <h2 className="text-sm font-bold mb-2">Recently Copied</h2>
          <div className="flex flex-wrap gap-2">
            {history.map((h, i) => (
              <button key={i} onClick={() => copy(h)} className="flex items-center gap-1 bg-[var(--bg-primary)] rounded px-2 py-1 text-xs font-mono hover:scale-105 transition-transform">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: h }} />
                {h}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
