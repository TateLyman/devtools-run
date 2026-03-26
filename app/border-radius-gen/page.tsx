"use client";
import { useState } from "react";

export default function BorderRadiusGen() {
  const [tl, setTl] = useState(20);
  const [tr, setTr] = useState(20);
  const [br, setBr] = useState(20);
  const [bl, setBl] = useState(20);
  const [linked, setLinked] = useState(true);
  const [size, setSize] = useState(200);
  const [bg, setBg] = useState("#3b82f6");

  const setAll = (v: number) => { if (linked) { setTl(v); setTr(v); setBr(v); setBl(v); } };
  const radius = `${tl}px ${tr}px ${br}px ${bl}px`;
  const css = `border-radius: ${tl === tr && tr === br && br === bl ? `${tl}px` : radius};`;

  const copy = () => navigator.clipboard.writeText(css);

  const presets = [
    { name: "None", values: [0, 0, 0, 0] },
    { name: "Rounded", values: [8, 8, 8, 8] },
    { name: "Pill", values: [100, 100, 100, 100] },
    { name: "Circle", values: [50, 50, 50, 50] },
    { name: "Blob 1", values: [30, 70, 30, 70] },
    { name: "Blob 2", values: [60, 10, 60, 10] },
    { name: "Card", values: [12, 12, 12, 12] },
    { name: "Drop", values: [50, 50, 50, 0] },
  ];

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">CSS Border Radius Generator</h1>
        <p className="text-[var(--text-secondary)]">Create rounded corners visually</p>
      </section>

      <div className="flex justify-center">
        <div className="w-48 h-48 md:w-64 md:h-64 transition-all" style={{ borderRadius: radius, backgroundColor: bg, width: size, height: size }} />
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <label className="text-sm"><input type="checkbox" checked={linked} onChange={e => setLinked(e.target.checked)} className="mr-1" />Link corners</label>
          <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
        </div>

        {linked ? (
          <div>
            <label className="text-sm text-[var(--text-secondary)]">All Corners: {tl}px</label>
            <input type="range" min={0} max={100} value={tl} onChange={e => { const v = Number(e.target.value); setTl(v); setTr(v); setBr(v); setBl(v); }} className="w-full" />
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {[["Top Left", tl, setTl], ["Top Right", tr, setTr], ["Bottom Right", br, setBr], ["Bottom Left", bl, setBl]].map(([label, val, set]) => (
              <div key={label as string}>
                <label className="text-sm text-[var(--text-secondary)]">{label as string}: {val as number}px</label>
                <input type="range" min={0} max={100} value={val as number} onChange={e => (set as (v: number) => void)(Number(e.target.value))} className="w-full" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex justify-between items-center">
          <code className="font-mono text-sm text-emerald-400">{css}</code>
          <button onClick={copy} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-3">Presets</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {presets.map(p => (
            <button key={p.name} onClick={() => { setTl(p.values[0]); setTr(p.values[1]); setBr(p.values[2]); setBl(p.values[3]); }} className="text-center">
              <div className="w-12 h-12 mx-auto bg-blue-500/30 border border-blue-500/50" style={{ borderRadius: `${p.values[0]}px ${p.values[1]}px ${p.values[2]}px ${p.values[3]}px` }} />
              <span className="text-xs text-[var(--text-secondary)] mt-1 block">{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
