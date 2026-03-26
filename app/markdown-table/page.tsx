"use client";
import { useState } from "react";

export default function MarkdownTable() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [data, setData] = useState<string[][]>([
    ["Header 1", "Header 2", "Header 3"],
    ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"],
    ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3"],
  ]);
  const [align, setAlign] = useState<("left"|"center"|"right")[]>(["left","left","left"]);

  const updateCell = (r: number, c: number, v: string) => {
    const d = data.map(row => [...row]); d[r][c] = v; setData(d);
  };

  const addRow = () => { setData([...data, Array(cols).fill("")]); setRows(rows + 1); };
  const addCol = () => { setData(data.map(r => [...r, ""])); setAlign([...align, "left"]); setCols(cols + 1); };
  const removeRow = () => { if (rows > 2) { setData(data.slice(0, -1)); setRows(rows - 1); } };
  const removeCol = () => { if (cols > 1) { setData(data.map(r => r.slice(0, -1))); setAlign(align.slice(0, -1)); setCols(cols - 1); } };

  const alignStr = (a: string) => a === "center" ? ":---:" : a === "right" ? "---:" : "---";

  const markdown = [
    "| " + data[0].map(c => c || " ").join(" | ") + " |",
    "| " + align.map(a => alignStr(a)).join(" | ") + " |",
    ...data.slice(1).map(row => "| " + row.map(c => c || " ").join(" | ") + " |"),
  ].join("\n");

  const copy = () => navigator.clipboard.writeText(markdown);

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Markdown Table Generator</h1>
        <p className="text-[var(--text-secondary)]">Create Markdown tables visually</p>
      </section>

      <div className="flex justify-center gap-2 flex-wrap">
        <button onClick={addRow} className="bg-[var(--bg-secondary)] border border-[var(--border)] px-3 py-1 rounded text-sm hover:bg-[var(--bg-primary)]">+ Row</button>
        <button onClick={removeRow} className="bg-[var(--bg-secondary)] border border-[var(--border)] px-3 py-1 rounded text-sm hover:bg-[var(--bg-primary)]">- Row</button>
        <button onClick={addCol} className="bg-[var(--bg-secondary)] border border-[var(--border)] px-3 py-1 rounded text-sm hover:bg-[var(--bg-primary)]">+ Col</button>
        <button onClick={removeCol} className="bg-[var(--bg-secondary)] border border-[var(--border)] px-3 py-1 rounded text-sm hover:bg-[var(--bg-primary)]">- Col</button>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {data[0].map((_, c) => (
                <th key={c} className="p-1">
                  <input value={data[0][c]} onChange={e => updateCell(0, c, e.target.value)}
                    className="w-full bg-blue-900/30 border border-blue-500/30 rounded px-2 py-1.5 text-sm font-bold text-center" />
                  <div className="flex justify-center gap-1 mt-1">
                    {(["left","center","right"] as const).map(a => (
                      <button key={a} onClick={() => { const al = [...align]; al[c] = a; setAlign(al); }}
                        className={`text-xs px-1 rounded ${align[c] === a ? "bg-blue-600 text-white" : "text-[var(--text-secondary)]"}`}>
                        {a === "left" ? "⬅" : a === "center" ? "↔" : "➡"}
                      </button>
                    ))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(1).map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} className="p-1">
                    <input value={cell} onChange={e => updateCell(r + 1, c, e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-sm" style={{ textAlign: align[c] }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex justify-between mb-2">
          <label className="text-sm font-bold">Markdown Output</label>
          <button onClick={copy} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button>
        </div>
        <pre className="font-mono text-sm text-emerald-400 whitespace-pre overflow-x-auto">{markdown}</pre>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <label className="text-sm font-bold block mb-2">Preview</label>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>{data[0].map((h, i) => <th key={i} className="border border-[var(--border)] px-3 py-2 bg-[var(--bg-primary)]" style={{ textAlign: align[i] }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {data.slice(1).map((row, r) => (
                <tr key={r}>{row.map((cell, c) => <td key={c} className="border border-[var(--border)] px-3 py-2" style={{ textAlign: align[c] }}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
