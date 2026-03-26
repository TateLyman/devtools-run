"use client";
import { useState } from "react";

const PRESETS: Record<string, string> = {
  "Triangle": "polygon(50% 0%, 0% 100%, 100% 100%)",
  "Arrow Right": "polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)",
  "Star": "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
  "Pentagon": "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
  "Hexagon": "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
  "Octagon": "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
  "Diamond": "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
  "Cross": "polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)",
  "Circle": "circle(50% at 50% 50%)",
  "Ellipse": "ellipse(50% 35% at 50% 50%)",
  "Inset": "inset(10% 10% 10% 10% round 10px)",
  "Chevron": "polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%)",
  "Rabbet": "polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)",
  "Trapezoid": "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
  "Parallelogram": "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)",
  "Rhombus": "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
};

export default function ClipPathGen() {
  const [selected, setSelected] = useState("Triangle");
  const [custom, setCustom] = useState("");

  const clipPath = custom || PRESETS[selected];
  const css = `clip-path: ${clipPath};`;
  const copy = () => navigator.clipboard.writeText(css);

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">CSS Clip Path Generator</h1>
        <p className="text-[var(--text-secondary)]">Create custom shapes with clip-path</p>
      </section>

      <div className="flex justify-center p-8 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl">
        <div className="w-64 h-64 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" style={{ clipPath }} />
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold mb-3">Presets</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {Object.entries(PRESETS).map(([name, path]) => (
            <button key={name} onClick={() => { setSelected(name); setCustom(""); }} className="text-center">
              <div className="w-12 h-12 mx-auto bg-blue-500" style={{ clipPath: path }} />
              <span className="text-xs text-[var(--text-secondary)] mt-1 block">{name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <label className="text-sm text-[var(--text-secondary)] block mb-1">Custom clip-path (optional)</label>
        <input value={custom} onChange={e => setCustom(e.target.value)} placeholder="polygon(50% 0%, 0% 100%, 100% 100%)"
          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-sm" />
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex justify-between mb-2">
          <label className="text-sm font-bold">CSS</label>
          <button onClick={copy} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button>
        </div>
        <code className="font-mono text-sm text-emerald-400">{css}</code>
      </div>
    </div>
  );
}
