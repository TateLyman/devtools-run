"use client";
import { useState } from "react";
export default function ContainerQuery() {
  const [width, setWidth] = useState(500);
  const [breakpoint, setBreakpoint] = useState(400);
  const isWide = width >= breakpoint;
  const css = `.container {\n  container-type: inline-size;\n  container-name: card;\n  width: ${width}px;\n}\n\n@container card (min-width: ${breakpoint}px) {\n  .card-content {\n    display: flex;\n    flex-direction: row;\n    gap: 16px;\n  }\n}\n\n@container card (max-width: ${breakpoint - 1}px) {\n  .card-content {\n    display: flex;\n    flex-direction: column;\n  }\n}`;
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Container Queries</h1><p className="text-[var(--text-secondary)]">Resize the container — layout responds to container width, not viewport</p></section>
      <div className="flex justify-center"><div className="border-2 border-dashed border-blue-500/50 rounded-xl p-4 transition-all" style={{ width, containerType: "inline-size" }}>
        <div className="text-xs text-blue-400 mb-2">{width}px container {isWide ? "(wide)" : "(narrow)"}</div>
        <div className={`flex ${isWide ? "flex-row gap-4" : "flex-col gap-2"} transition-all`}>
          <div className="bg-blue-500/20 rounded-lg p-3 flex-1"><div className="w-full h-20 bg-blue-500/30 rounded mb-2" /><div className="text-sm font-bold">Image Area</div></div>
          <div className="flex-1"><div className="text-sm font-bold mb-1">Card Title</div><div className="text-xs text-[var(--text-secondary)]">This card layout changes based on its container width, not the viewport. Drag the slider to see it switch between row and column layouts.</div></div>
        </div>
      </div></div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 grid gap-3 md:grid-cols-2">
        <div><label className="text-xs text-[var(--text-secondary)]">Container Width: {width}px</label><input type="range" min={200} max={800} value={width} onChange={e=>setWidth(Number(e.target.value))} className="w-full" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Breakpoint: {breakpoint}px</label><input type="range" min={200} max={600} value={breakpoint} onChange={e=>setBreakpoint(Number(e.target.value))} className="w-full" /></div>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">CSS</label><button onClick={()=>navigator.clipboard.writeText(css)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button></div><pre className="font-mono text-xs text-emerald-400 whitespace-pre">{css}</pre></div>
    </div>
  );
}
