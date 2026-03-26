"use client";
import { useState } from "react";

type Stop = { color: string; position: number };

export default function GradientGen() {
  const [type, setType] = useState<"linear" | "radial" | "conic">("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<Stop[]>([
    { color: "#667eea", position: 0 },
    { color: "#764ba2", position: 100 },
  ]);

  const stopsCSS = stops.map(s => `${s.color} ${s.position}%`).join(", ");
  const gradient = type === "linear"
    ? `linear-gradient(${angle}deg, ${stopsCSS})`
    : type === "radial"
    ? `radial-gradient(circle, ${stopsCSS})`
    : `conic-gradient(from ${angle}deg, ${stopsCSS})`;

  const css = `background: ${gradient};`;

  const addStop = () => {
    const pos = stops.length > 0 ? Math.min(stops[stops.length - 1].position + 20, 100) : 50;
    setStops([...stops, { color: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"), position: pos }]);
  };

  const removeStop = (i: number) => { if (stops.length > 2) setStops(stops.filter((_, j) => j !== i)); };

  const updateStop = (i: number, key: keyof Stop, val: string | number) => {
    const n = [...stops]; n[i] = { ...n[i], [key]: val }; setStops(n);
  };

  const copy = () => navigator.clipboard.writeText(css);

  const presets = [
    [{ color: "#667eea", position: 0 }, { color: "#764ba2", position: 100 }],
    [{ color: "#f093fb", position: 0 }, { color: "#f5576c", position: 100 }],
    [{ color: "#4facfe", position: 0 }, { color: "#00f2fe", position: 100 }],
    [{ color: "#43e97b", position: 0 }, { color: "#38f9d7", position: 100 }],
    [{ color: "#fa709a", position: 0 }, { color: "#fee140", position: 100 }],
    [{ color: "#a18cd1", position: 0 }, { color: "#fbc2eb", position: 100 }],
    [{ color: "#ffecd2", position: 0 }, { color: "#fcb69f", position: 100 }],
    [{ color: "#ff9a9e", position: 0 }, { color: "#fad0c4", position: 100 }],
  ];

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">CSS Gradient Generator</h1>
        <p className="text-[var(--text-secondary)]">Create beautiful gradients visually</p>
      </section>

      <div className="h-48 rounded-xl border border-[var(--border)]" style={{ background: gradient }} />

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 space-y-4">
        <div className="flex gap-2">
          {(["linear", "radial", "conic"] as const).map(t => (
            <button key={t} onClick={() => setType(t)} className={`px-4 py-2 rounded-lg text-sm font-bold capitalize ${type === t ? "bg-blue-600 text-white" : "bg-[var(--bg-primary)] border border-[var(--border)]"}`}>{t}</button>
          ))}
        </div>
        {(type === "linear" || type === "conic") && (
          <div>
            <label className="text-sm text-[var(--text-secondary)]">Angle: {angle}°</label>
            <input type="range" min={0} max={360} value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full" />
          </div>
        )}
        <div className="space-y-2">
          {stops.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="color" value={s.color} onChange={e => updateStop(i, "color", e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
              <input value={s.color} onChange={e => updateStop(i, "color", e.target.value)} className="w-24 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono text-sm" />
              <input type="range" min={0} max={100} value={s.position} onChange={e => updateStop(i, "position", Number(e.target.value))} className="flex-1" />
              <span className="text-xs w-8 text-[var(--text-secondary)]">{s.position}%</span>
              {stops.length > 2 && <button onClick={() => removeStop(i)} className="text-red-400 text-xs">x</button>}
            </div>
          ))}
          <button onClick={addStop} className="text-sm text-blue-400 hover:text-blue-300">+ Add Color Stop</button>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold">CSS Code</span>
          <button onClick={copy} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button>
        </div>
        <code className="text-sm font-mono text-emerald-400 break-all">{css}</code>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-3">Presets</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {presets.map((p, i) => (
            <button key={i} onClick={() => setStops(p)} className="h-12 rounded-lg border border-[var(--border)] hover:scale-105 transition-transform"
              style={{ background: `linear-gradient(135deg, ${p[0].color}, ${p[1].color})` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
