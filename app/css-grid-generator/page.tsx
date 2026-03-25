"use client";
import { useState } from "react";

export default function CSSGridGenerator() {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(3);
  const [gap, setGap] = useState(16);
  const [colSizes, setColSizes] = useState<string[]>(["1fr", "1fr", "1fr"]);
  const [rowSizes, setRowSizes] = useState<string[]>(["auto", "auto", "auto"]);
  const [items, setItems] = useState(9);
  const [copied, setCopied] = useState(false);

  const updateCols = (n: number) => {
    setCols(n);
    setColSizes(Array.from({ length: n }, (_, i) => colSizes[i] || "1fr"));
  };

  const updateRows = (n: number) => {
    setRows(n);
    setRowSizes(Array.from({ length: n }, (_, i) => rowSizes[i] || "auto"));
  };

  const css = `.grid-container {
  display: grid;
  grid-template-columns: ${colSizes.slice(0, cols).join(" ")};
  grid-template-rows: ${rowSizes.slice(0, rows).join(" ")};
  gap: ${gap}px;
}`;

  const html = `<div class="grid-container">
${Array.from({ length: items }, (_, i) => `  <div class="grid-item">${i + 1}</div>`).join("\n")}
</div>`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">CSS Grid Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Visual CSS Grid layout builder. Adjust columns, rows, gap, and sizes. Copy the generated code.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <h2 className="font-bold">Grid Settings</h2>
            <div className="space-y-2">
              <label className="block text-sm">Columns: {cols}</label>
              <input type="range" min={1} max={12} value={cols} onChange={(e) => updateCols(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm">Rows: {rows}</label>
              <input type="range" min={1} max={12} value={rows} onChange={(e) => updateRows(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm">Gap: {gap}px</label>
              <input type="range" min={0} max={64} value={gap} onChange={(e) => setGap(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm">Items: {items}</label>
              <input type="range" min={1} max={24} value={items} onChange={(e) => setItems(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <h2 className="font-bold">Column Sizes</h2>
            {colSizes.slice(0, cols).map((size, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-8">Col {i + 1}</span>
                <select value={size} onChange={(e) => { const c = [...colSizes]; c[i] = e.target.value; setColSizes(c); }} className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-white text-sm">
                  <option value="1fr">1fr</option>
                  <option value="2fr">2fr</option>
                  <option value="auto">auto</option>
                  <option value="100px">100px</option>
                  <option value="150px">150px</option>
                  <option value="200px">200px</option>
                  <option value="250px">250px</option>
                  <option value="minmax(100px, 1fr)">minmax(100px, 1fr)</option>
                </select>
              </div>
            ))}
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <h2 className="font-bold">Row Sizes</h2>
            {rowSizes.slice(0, rows).map((size, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-8">Row {i + 1}</span>
                <select value={size} onChange={(e) => { const r = [...rowSizes]; r[i] = e.target.value; setRowSizes(r); }} className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-white text-sm">
                  <option value="auto">auto</option>
                  <option value="1fr">1fr</option>
                  <option value="50px">50px</option>
                  <option value="100px">100px</option>
                  <option value="150px">150px</option>
                  <option value="200px">200px</option>
                  <option value="minmax(50px, auto)">minmax(50px, auto)</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6">
            <h2 className="font-bold mb-3">Preview</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: colSizes.slice(0, cols).join(" "),
                gridTemplateRows: rowSizes.slice(0, rows).join(" "),
                gap: `${gap}px`,
              }}
            >
              {Array.from({ length: items }, (_, i) => (
                <div key={i} className="bg-purple-600/30 border border-purple-500/50 rounded p-4 text-center text-sm font-mono text-purple-300 min-h-[60px] flex items-center justify-center">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium">CSS</label>
                <button onClick={() => handleCopy(css)} className="text-xs text-purple-400 hover:text-purple-300">{copied ? "Copied!" : "Copy"}</button>
              </div>
              <pre className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-3 text-sm font-mono text-emerald-400 overflow-auto">{css}</pre>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium">HTML</label>
                <button onClick={() => handleCopy(html)} className="text-xs text-purple-400 hover:text-purple-300">Copy</button>
              </div>
              <pre className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-3 text-sm font-mono text-blue-400 overflow-auto">{html}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
