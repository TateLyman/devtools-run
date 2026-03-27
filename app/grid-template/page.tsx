"use client";
import { useState } from "react";
export default function GridTemplate() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [areas, setAreas] = useState<string[][]>([["header","header","header"],["sidebar","main","main"],["footer","footer","footer"]]);
  const [selected, setSelected] = useState("header");
  const names = [...new Set(areas.flat())];
  const colors: Record<string, string> = {};
  const palette = ["#3b82f6","#ef4444","#22c55e","#f97316","#8b5cf6","#ec4899","#06b6d4","#eab308","#6b7280"];
  names.forEach((n, i) => colors[n] = palette[i % palette.length]);

  const setArea = (r: number, c: number) => {
    const a = areas.map(row => [...row]);
    a[r][c] = selected;
    setAreas(a);
  };

  const addRow = () => { setRows(rows + 1); setAreas([...areas, Array(cols).fill("new")]); };
  const addCol = () => { setCols(cols + 1); setAreas(areas.map(r => [...r, "new"])); };

  const templateAreas = areas.map(row => `"${row.join(" ")}"`).join("\n    ");
  const css = `.container {\n  display: grid;\n  grid-template-areas:\n    ${templateAreas};\n  grid-template-rows: repeat(${rows}, 1fr);\n  grid-template-columns: repeat(${cols}, 1fr);\n  gap: 8px;\n}\n\n${names.map(n => `.${n} { grid-area: ${n}; }`).join("\n")}`;

  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">CSS Grid Template Areas</h1><p className="text-[var(--text-secondary)]">Click cells to assign named grid areas</p></section>
      <div className="flex flex-wrap gap-2 justify-center">
        {names.map(n => (<button key={n} onClick={() => setSelected(n)} className={`px-3 py-1 rounded text-sm font-bold text-white ${selected === n ? "ring-2 ring-white" : "opacity-70"}`} style={{ backgroundColor: colors[n] }}>{n}</button>))}
        <button onClick={() => { const name = prompt("New area name:"); if (name) setSelected(name); }} className="px-3 py-1 rounded text-sm bg-[var(--bg-secondary)] border border-[var(--border)]">+ New</button>
      </div>
      <div className="flex justify-center"><div className="inline-grid border border-[var(--border)] rounded-xl overflow-hidden" style={{ gridTemplateColumns: `repeat(${cols}, 80px)`, gridTemplateRows: `repeat(${rows}, 60px)` }}>
        {areas.map((row, r) => row.map((cell, c) => (<button key={`${r}-${c}`} onClick={() => setArea(r, c)} className="flex items-center justify-center text-xs font-bold text-white border border-[var(--border)]/30" style={{ backgroundColor: colors[cell] || "#6b7280" }}>{cell}</button>)))}
      </div></div>
      <div className="flex justify-center gap-2"><button onClick={addRow} className="bg-[var(--bg-secondary)] border border-[var(--border)] px-3 py-1 rounded text-sm">+ Row</button><button onClick={addCol} className="bg-[var(--bg-secondary)] border border-[var(--border)] px-3 py-1 rounded text-sm">+ Col</button></div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">CSS</label><button onClick={() => navigator.clipboard.writeText(css)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button></div><pre className="font-mono text-xs text-emerald-400 whitespace-pre">{css}</pre></div>
    </div>
  );
}
