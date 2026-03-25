"use client";
import { useState } from "react";

export default function FlexboxGenerator() {
  const [direction, setDirection] = useState("row");
  const [justify, setJustify] = useState("flex-start");
  const [align, setAlign] = useState("stretch");
  const [wrap, setWrap] = useState("nowrap");
  const [gap, setGap] = useState(16);
  const [itemCount, setItemCount] = useState(5);
  const [copied, setCopied] = useState(false);

  const css = `.flex-container {
  display: flex;
  flex-direction: ${direction};
  justify-content: ${justify};
  align-items: ${align};
  flex-wrap: ${wrap};
  gap: ${gap}px;
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const options = {
    direction: ["row", "row-reverse", "column", "column-reverse"],
    justify: ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"],
    align: ["stretch", "flex-start", "flex-end", "center", "baseline"],
    wrap: ["nowrap", "wrap", "wrap-reverse"],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Flexbox Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Visual CSS Flexbox playground. Adjust properties with live preview and copy the generated CSS.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <h2 className="font-bold">Properties</h2>

            <div>
              <label className="block text-xs text-gray-400 mb-1">flex-direction</label>
              <div className="flex flex-wrap gap-1">
                {options.direction.map((d) => (
                  <button key={d} onClick={() => setDirection(d)} className={`px-2 py-1 rounded text-xs ${direction === d ? "bg-purple-600 text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"}`}>{d}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">justify-content</label>
              <div className="flex flex-wrap gap-1">
                {options.justify.map((j) => (
                  <button key={j} onClick={() => setJustify(j)} className={`px-2 py-1 rounded text-xs ${justify === j ? "bg-purple-600 text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"}`}>{j}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">align-items</label>
              <div className="flex flex-wrap gap-1">
                {options.align.map((a) => (
                  <button key={a} onClick={() => setAlign(a)} className={`px-2 py-1 rounded text-xs ${align === a ? "bg-purple-600 text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"}`}>{a}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">flex-wrap</label>
              <div className="flex gap-1">
                {options.wrap.map((w) => (
                  <button key={w} onClick={() => setWrap(w)} className={`px-2 py-1 rounded text-xs ${wrap === w ? "bg-purple-600 text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"}`}>{w}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">gap: {gap}px</label>
              <input type="range" min={0} max={64} value={gap} onChange={(e) => setGap(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">items: {itemCount}</label>
              <input type="range" min={1} max={12} value={itemCount} onChange={(e) => setItemCount(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6">
            <h2 className="font-bold mb-3">Preview</h2>
            <div
              style={{
                display: "flex",
                flexDirection: direction as any,
                justifyContent: justify,
                alignItems: align,
                flexWrap: wrap as any,
                gap: `${gap}px`,
                minHeight: "200px",
                border: "1px dashed rgba(147, 51, 234, 0.3)",
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              {Array.from({ length: itemCount }, (_, i) => {
                const heights = [60, 80, 50, 100, 70, 90, 55, 85, 65, 95, 75, 110];
                return (
                  <div
                    key={i}
                    className="bg-purple-600/30 border border-purple-500/50 rounded px-6 flex items-center justify-center text-sm font-mono text-purple-300"
                    style={{ minHeight: `${heights[i % heights.length]}px`, minWidth: "60px" }}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">Generated CSS</label>
              <button onClick={handleCopy} className="text-xs text-purple-400 hover:text-purple-300">{copied ? "Copied!" : "Copy"}</button>
            </div>
            <pre className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-3 text-sm font-mono text-emerald-400">{css}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
