"use client";
import { useState } from "react";

type Shadow = { x: number; y: number; blur: number; spread: number; color: string; inset: boolean };

export default function ShadowGen() {
  const [shadows, setShadows] = useState<Shadow[]>([{ x: 5, y: 5, blur: 15, spread: 0, color: "#00000040", inset: false }]);
  const [bg, setBg] = useState("#3b82f6");

  const css = shadows.map(s => `${s.inset ? "inset " : ""}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`).join(",\n    ");
  const fullCss = `box-shadow: ${css};`;

  const update = (i: number, key: keyof Shadow, val: number | string | boolean) => {
    const s = [...shadows]; s[i] = { ...s[i], [key]: val }; setShadows(s);
  };

  const addShadow = () => setShadows([...shadows, { x: 0, y: 0, blur: 10, spread: 0, color: "#00000020", inset: false }]);
  const removeShadow = (i: number) => { if (shadows.length > 1) setShadows(shadows.filter((_, j) => j !== i)); };
  const copy = () => navigator.clipboard.writeText(fullCss);

  const presets = [
    [{ x: 0, y: 1, blur: 3, spread: 0, color: "#0000001a", inset: false }, { x: 0, y: 1, blur: 2, spread: -1, color: "#0000001a", inset: false }],
    [{ x: 0, y: 4, blur: 6, spread: -1, color: "#0000001a", inset: false }, { x: 0, y: 2, blur: 4, spread: -2, color: "#0000001a", inset: false }],
    [{ x: 0, y: 10, blur: 15, spread: -3, color: "#0000001a", inset: false }, { x: 0, y: 4, blur: 6, spread: -4, color: "#0000001a", inset: false }],
    [{ x: 0, y: 20, blur: 25, spread: -5, color: "#0000001a", inset: false }, { x: 0, y: 8, blur: 10, spread: -6, color: "#0000001a", inset: false }],
  ];

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">CSS Box Shadow Generator</h1>
        <p className="text-[var(--text-secondary)]">Create shadows visually</p>
      </section>

      <div className="flex justify-center p-12 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)]">
        <div className="w-48 h-48 rounded-xl" style={{ backgroundColor: bg, boxShadow: shadows.map(s => `${s.inset ? "inset " : ""}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`).join(", ") }} />
      </div>

      <div className="space-y-3">
        {shadows.map((s, i) => (
          <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold">Shadow {i + 1}</span>
              <div className="flex gap-2 items-center">
                <label className="text-xs"><input type="checkbox" checked={s.inset} onChange={e => update(i, "inset", e.target.checked)} className="mr-1" />Inset</label>
                <input type="color" value={s.color.slice(0, 7)} onChange={e => update(i, "color", e.target.value + "40")} className="w-8 h-8 rounded cursor-pointer" />
                {shadows.length > 1 && <button onClick={() => removeShadow(i)} className="text-red-400 text-xs">Remove</button>}
              </div>
            </div>
            <div className="grid gap-2 md:grid-cols-4">
              {([["X Offset", "x", -50, 50], ["Y Offset", "y", -50, 50], ["Blur", "blur", 0, 100], ["Spread", "spread", -50, 50]] as const).map(([label, key, min, max]) => (
                <div key={label}>
                  <label className="text-xs text-[var(--text-secondary)]">{label}: {s[key]}px</label>
                  <input type="range" min={min} max={max} value={s[key] as number} onChange={e => update(i, key, Number(e.target.value))} className="w-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={addShadow} className="text-sm text-blue-400 hover:text-blue-300">+ Add Shadow Layer</button>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex justify-between mb-2">
          <label className="text-sm font-bold">CSS</label>
          <button onClick={copy} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button>
        </div>
        <pre className="font-mono text-sm text-emerald-400 whitespace-pre-wrap">{fullCss}</pre>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <h2 className="text-sm font-bold mb-2">Presets</h2>
        <div className="flex gap-3 justify-center">
          {presets.map((p, i) => (
            <button key={i} onClick={() => setShadows(p)}
              className="w-16 h-16 bg-white rounded-lg" style={{ boxShadow: p.map(s => `${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`).join(", ") }} />
          ))}
        </div>
      </div>
    </div>
  );
}
