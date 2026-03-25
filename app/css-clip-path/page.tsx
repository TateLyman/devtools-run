"use client";
import { useState } from "react";

const presets: Record<string, { path: string; label: string }> = {
  triangle: { path: "polygon(50% 0%, 0% 100%, 100% 100%)", label: "Triangle" },
  diamond: { path: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", label: "Diamond" },
  pentagon: { path: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)", label: "Pentagon" },
  hexagon: { path: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)", label: "Hexagon" },
  star: { path: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)", label: "Star" },
  arrow: { path: "polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)", label: "Arrow" },
  cross: { path: "polygon(10% 25%, 35% 25%, 35% 0%, 65% 0%, 65% 25%, 90% 25%, 90% 50%, 65% 50%, 65% 75%, 90% 75%, 90% 100%, 10% 100%, 10% 75%, 35% 75%, 35% 50%, 10% 50%)", label: "Cross" },
  circle: { path: "circle(50% at 50% 50%)", label: "Circle" },
  ellipse: { path: "ellipse(40% 30% at 50% 50%)", label: "Ellipse" },
  inset: { path: "inset(10% 20% 10% 20% round 10px)", label: "Inset Rounded" },
  trapezoid: { path: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)", label: "Trapezoid" },
  parallelogram: { path: "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)", label: "Parallelogram" },
};

export default function CSSClipPath() {
  const [selected, setSelected] = useState("hexagon");
  const [custom, setCustom] = useState("");
  const [copied, setCopied] = useState(false);

  const clipPath = custom || presets[selected]?.path || "";
  const css = `.clipped {\n  clip-path: ${clipPath};\n}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">CSS Clip-Path Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Create CSS clip-path shapes with 12 presets. Preview, customize, and copy the CSS code. Free online clip-path maker.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(presets).map(([k, v]) => (
              <button key={k} onClick={() => { setSelected(k); setCustom(""); }} className={`px-2 py-2 rounded text-xs ${selected === k && !custom ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white"}`}>{v.label}</button>
            ))}
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Custom clip-path (optional)</label>
            <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="polygon(50% 0%, 100% 100%, 0% 100%)" className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white font-mono text-sm" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">CSS</label>
              <button onClick={handleCopy} className="text-xs text-purple-400 hover:text-purple-300">{copied ? "Copied!" : "Copy"}</button>
            </div>
            <pre className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-3 text-xs font-mono text-emerald-400">{css}</pre>
          </div>
        </div>

        <div className="flex items-center justify-center bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-8 min-h-[300px]">
          <div
            className="w-64 h-64 bg-gradient-to-br from-purple-500 to-blue-500"
            style={{ clipPath: clipPath }}
          />
        </div>
      </div>
    </div>
  );
}
