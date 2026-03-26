"use client";
import { useState } from "react";

const EASINGS: [string, string][] = [
  ["linear", "linear"], ["ease", "ease"], ["ease-in", "ease-in"], ["ease-out", "ease-out"],
  ["ease-in-out", "ease-in-out"],
  ["cubic-bezier(0.4, 0, 0.2, 1)", "Material"],
  ["cubic-bezier(0.22, 1, 0.36, 1)", "Smooth Out"],
  ["cubic-bezier(0.34, 1.56, 0.64, 1)", "Bounce"],
  ["cubic-bezier(0.65, 0, 0.35, 1)", "Sine"],
  ["cubic-bezier(0.76, 0, 0.24, 1)", "Expo"],
];

export default function TransitionGen() {
  const [property, setProperty] = useState("all");
  const [duration, setDuration] = useState("0.3");
  const [delay, setDelay] = useState("0");
  const [easing, setEasing] = useState("ease");
  const [active, setActive] = useState(false);

  const css = `transition: ${property} ${duration}s ${easing}${parseFloat(delay) > 0 ? ` ${delay}s` : ""};`;

  const copy = () => navigator.clipboard.writeText(css);

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">CSS Transition Generator</h1>
        <p className="text-[var(--text-secondary)]">Create smooth CSS transitions visually</p>
      </section>

      <div className="flex justify-center">
        <div className="relative w-64 h-32 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl overflow-hidden cursor-pointer" onClick={() => setActive(!active)}>
          <div className="w-16 h-16 bg-blue-600 rounded-xl absolute top-1/2 -translate-y-1/2"
            style={{ left: active ? "calc(100% - 80px)" : "16px", opacity: active ? 1 : 0.6, transform: `translateY(-50%) scale(${active ? 1.2 : 1}) rotate(${active ? 45 : 0}deg)`, transition: `${property} ${duration}s ${easing} ${delay}s` }} />
          <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-[var(--text-secondary)]">Click to animate</div>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs text-[var(--text-secondary)] block mb-1">Property</label>
            <select value={property} onChange={e => setProperty(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-sm">
              {["all","opacity","transform","background-color","color","width","height","margin","padding","border"].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-[var(--text-secondary)] block mb-1">Easing</label>
            <select value={easing} onChange={e => setEasing(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-sm">
              {EASINGS.map(([v, n]) => <option key={v} value={v}>{n} ({v})</option>)}
            </select>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs text-[var(--text-secondary)]">Duration: {duration}s</label>
            <input type="range" min={0.1} max={3} step={0.1} value={duration} onChange={e => setDuration(e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-secondary)]">Delay: {delay}s</label>
            <input type="range" min={0} max={2} step={0.1} value={delay} onChange={e => setDelay(e.target.value)} className="w-full" />
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex justify-between mb-2">
          <label className="text-sm font-bold">CSS</label>
          <button onClick={copy} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button>
        </div>
        <code className="font-mono text-sm text-emerald-400">{css}</code>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <h2 className="text-sm font-bold mb-2">All Easings Preview</h2>
        <div className="grid gap-2 md:grid-cols-2">
          {EASINGS.map(([v, n]) => (
            <button key={v} onClick={() => setEasing(v)}
              className={`text-left bg-[var(--bg-primary)] rounded-lg px-3 py-2 text-sm border ${easing === v ? "border-blue-500" : "border-transparent"}`}>
              <span className="font-bold">{n}</span>
              <span className="text-xs text-[var(--text-secondary)] ml-2">{v}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
