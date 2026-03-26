"use client";
import { useState } from "react";

export default function GridPlayground() {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(3);
  const [gap, setGap] = useState(8);
  const [colSizing, setColSizing] = useState("1fr");
  const [rowSizing, setRowSizing] = useState("auto");
  const items = cols * rows;

  const colTemplate = Array(cols).fill(colSizing).join(" ");
  const rowTemplate = Array(rows).fill(rowSizing).join(" ");
  const css = `display: grid;\ngrid-template-columns: ${colTemplate};\ngrid-template-rows: ${rowTemplate};\ngap: ${gap}px;`;

  const copy = () => navigator.clipboard.writeText(css);

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">CSS Grid Playground</h1>
        <p className="text-[var(--text-secondary)]">Visual CSS Grid layout generator</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4" style={{ display: "grid", gridTemplateColumns: colTemplate, gridTemplateRows: rowTemplate, gap: `${gap}px` }}>
        {Array.from({ length: items }, (_, i) => (
          <div key={i} className="bg-blue-600/80 text-white rounded-lg p-3 font-bold text-sm text-center min-h-[60px] flex items-center justify-center">{i + 1}</div>
        ))}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div><label className="text-xs text-[var(--text-secondary)]">Columns: {cols}</label><input type="range" min={1} max={8} value={cols} onChange={e => setCols(Number(e.target.value))} className="w-full" /></div>
          <div><label className="text-xs text-[var(--text-secondary)]">Rows: {rows}</label><input type="range" min={1} max={6} value={rows} onChange={e => setRows(Number(e.target.value))} className="w-full" /></div>
          <div><label className="text-xs text-[var(--text-secondary)]">Gap: {gap}px</label><input type="range" min={0} max={32} value={gap} onChange={e => setGap(Number(e.target.value))} className="w-full" /></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 mt-3">
          <div>
            <label className="text-xs text-[var(--text-secondary)] block mb-1">Column Sizing</label>
            <select value={colSizing} onChange={e => setColSizing(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-sm">
              {["1fr","auto","100px","150px","200px","minmax(100px, 1fr)"].map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-[var(--text-secondary)] block mb-1">Row Sizing</label>
            <select value={rowSizing} onChange={e => setRowSizing(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-sm">
              {["auto","1fr","50px","100px","150px","minmax(50px, auto)"].map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex justify-between mb-2">
          <label className="text-sm font-bold">CSS</label>
          <button onClick={copy} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button>
        </div>
        <pre className="font-mono text-sm text-emerald-400 whitespace-pre">{css}</pre>
      </div>
    </div>
  );
}
