"use client";
import { useState } from "react";

export default function CSSGradientGenerator() {
  const [type, setType] = useState<"linear" | "radial" | "conic">("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState([
    { color: "#6366f1", position: 0 },
    { color: "#a855f7", position: 50 },
    { color: "#ec4899", position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const addStop = () => {
    const lastPos = stops[stops.length - 1]?.position || 0;
    setStops([...stops, { color: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"), position: Math.min(100, lastPos + 20) }]);
  };

  const removeStop = (i: number) => stops.length > 2 && setStops(stops.filter((_, idx) => idx !== i));

  const updateStop = (i: number, field: "color" | "position", value: string | number) => {
    const copy = [...stops];
    (copy[i] as any)[field] = value;
    setStops(copy);
  };

  const gradientCSS = (() => {
    const stopsStr = stops.map((s) => `${s.color} ${s.position}%`).join(", ");
    if (type === "linear") return `linear-gradient(${angle}deg, ${stopsStr})`;
    if (type === "radial") return `radial-gradient(circle, ${stopsStr})`;
    return `conic-gradient(from ${angle}deg, ${stopsStr})`;
  })();

  const fullCSS = `background: ${gradientCSS};`;

  const presets = [
    { name: "Sunset", stops: [{ color: "#ff6b6b", position: 0 }, { color: "#feca57", position: 100 }], angle: 135 },
    { name: "Ocean", stops: [{ color: "#667eea", position: 0 }, { color: "#764ba2", position: 100 }], angle: 135 },
    { name: "Forest", stops: [{ color: "#11998e", position: 0 }, { color: "#38ef7d", position: 100 }], angle: 135 },
    { name: "Fire", stops: [{ color: "#f12711", position: 0 }, { color: "#f5af19", position: 100 }], angle: 135 },
    { name: "Aurora", stops: [{ color: "#a8ff78", position: 0 }, { color: "#78ffd6", position: 50 }, { color: "#007991", position: 100 }], angle: 135 },
    { name: "Neon", stops: [{ color: "#ff00ff", position: 0 }, { color: "#00ffff", position: 100 }], angle: 90 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">CSS Gradient Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Create beautiful CSS gradients. Linear, radial, and conic. Multiple color stops, custom angles, presets. Copy the CSS.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {presets.map((p) => (
          <button key={p.name} onClick={() => { setStops(p.stops); setAngle(p.angle); }} className="px-3 py-1 rounded text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white">{p.name}</button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex gap-2">
            {(["linear", "radial", "conic"] as const).map((t) => (
              <button key={t} onClick={() => setType(t)} className={`px-3 py-1.5 rounded text-sm capitalize ${type === t ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400"}`}>{t}</button>
            ))}
          </div>

          {(type === "linear" || type === "conic") && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">Angle: {angle}°</label>
              <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
          )}

          <div className="space-y-2">
            {stops.map((stop, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="color" value={stop.color} onChange={(e) => updateStop(i, "color", e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                <input value={stop.color} onChange={(e) => updateStop(i, "color", e.target.value)} className="w-20 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-white text-xs font-mono" />
                <input type="range" min={0} max={100} value={stop.position} onChange={(e) => updateStop(i, "position", Number(e.target.value))} className="flex-1 accent-purple-500" />
                <span className="text-xs text-gray-400 w-8">{stop.position}%</span>
                {stops.length > 2 && <button onClick={() => removeStop(i)} className="text-xs text-red-400">✕</button>}
              </div>
            ))}
            <button onClick={addStop} className="text-xs text-purple-400 hover:text-purple-300">+ Add Color Stop</button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="w-full h-64 rounded-xl border border-[var(--border)]" style={{ background: gradientCSS }} />
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">CSS</label>
              <button onClick={() => { navigator.clipboard.writeText(fullCSS); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-purple-400">{copied ? "Copied!" : "Copy"}</button>
            </div>
            <pre className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-3 text-xs font-mono text-emerald-400 break-all">{fullCSS}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
