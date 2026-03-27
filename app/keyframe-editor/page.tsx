"use client";
import { useState } from "react";
type Keyframe = { pct: number; transform: string; opacity: string; bg: string };
export default function KeyframeEditor() {
  const [name, setName] = useState("myAnimation");
  const [duration, setDuration] = useState("1");
  const [timing, setTiming] = useState("ease");
  const [iterations, setIterations] = useState("infinite");
  const [frames, setFrames] = useState<Keyframe[]>([
    { pct: 0, transform: "translateY(0)", opacity: "1", bg: "#3b82f6" },
    { pct: 50, transform: "translateY(-20px)", opacity: "0.5", bg: "#8b5cf6" },
    { pct: 100, transform: "translateY(0)", opacity: "1", bg: "#3b82f6" },
  ]);
  const update = (i: number, key: keyof Keyframe, val: string) => { const f = [...frames]; f[i] = { ...f[i], [key]: key === "pct" ? Number(val) : val }; setFrames(f); };
  const add = () => setFrames([...frames, { pct: 100, transform: "translateY(0)", opacity: "1", bg: "#3b82f6" }].sort((a,b) => a.pct - b.pct));
  const remove = (i: number) => { if (frames.length > 2) setFrames(frames.filter((_,j) => j !== i)); };
  const css = `@keyframes ${name} {\n${frames.map(f => `  ${f.pct}% {\n    transform: ${f.transform};\n    opacity: ${f.opacity};\n    background-color: ${f.bg};\n  }`).join("\n")}\n}\n\n.element {\n  animation: ${name} ${duration}s ${timing} ${iterations};\n}`;
  const style = frames.reduce((acc, f) => { acc[`${f.pct}%`] = { transform: f.transform, opacity: f.opacity, backgroundColor: f.bg }; return acc; }, {} as Record<string, any>);
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">CSS Keyframe Editor</h1><p className="text-[var(--text-secondary)]">Build animations visually</p></section>
      <div className="flex justify-center p-8"><div className="w-20 h-20 rounded-xl" style={{ animation: `${name} ${duration}s ${timing} ${iterations}`, backgroundColor: frames[0]?.bg }} /></div>
      <style>{`@keyframes ${name} { ${frames.map(f => `${f.pct}% { transform: ${f.transform}; opacity: ${f.opacity}; background-color: ${f.bg}; }`).join(" ")} }`}</style>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 grid gap-3 md:grid-cols-4">
        <div><label className="text-xs text-[var(--text-secondary)]">Name</label><input value={name} onChange={e=>setName(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono text-sm" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Duration: {duration}s</label><input type="range" min={0.1} max={5} step={0.1} value={duration} onChange={e=>setDuration(e.target.value)} className="w-full" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Timing</label><select value={timing} onChange={e=>setTiming(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-sm">{["ease","linear","ease-in","ease-out","ease-in-out"].map(t=><option key={t}>{t}</option>)}</select></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Iterations</label><select value={iterations} onChange={e=>setIterations(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-sm">{["infinite","1","2","3"].map(i=><option key={i}>{i}</option>)}</select></div>
      </div>
      <div className="space-y-2">
        {frames.map((f, i) => (
          <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-3 flex gap-3 items-center flex-wrap">
            <div className="w-16"><label className="text-xs text-[var(--text-secondary)]">{f.pct}%</label><input type="range" min={0} max={100} value={f.pct} onChange={e => update(i, "pct", e.target.value)} className="w-full" /></div>
            <input value={f.transform} onChange={e => update(i, "transform", e.target.value)} className="flex-1 min-w-[120px] bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono text-xs" placeholder="transform" />
            <input value={f.opacity} onChange={e => update(i, "opacity", e.target.value)} className="w-16 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono text-xs" placeholder="opacity" />
            <input type="color" value={f.bg} onChange={e => update(i, "bg", e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
            {frames.length > 2 && <button onClick={() => remove(i)} className="text-red-400 text-xs">x</button>}
          </div>
        ))}
        <button onClick={add} className="text-sm text-blue-400">+ Add keyframe</button>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">CSS</label><button onClick={()=>navigator.clipboard.writeText(css)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button></div><pre className="font-mono text-xs text-emerald-400 whitespace-pre">{css}</pre></div>
    </div>
  );
}
