"use client";
import { useState } from "react";

function calculateSpecificity(selector: string): [number, number, number, number] {
  let a = 0, b = 0, c = 0, d = 0;
  // Remove :not() content but keep what's inside
  let s = selector.replace(/:not\(([^)]*)\)/g, " $1");
  // Remove pseudo-elements
  s = s.replace(/::[\w-]+/g, () => { d++; return ""; });
  // Count IDs
  const ids = s.match(/#[\w-]+/g);
  b = ids ? ids.length : 0;
  // Remove IDs
  s = s.replace(/#[\w-]+/g, "");
  // Count classes, attributes, pseudo-classes
  const classes = s.match(/\.[\w-]+|\[.*?\]|:[\w-]+/g);
  c = classes ? classes.length : 0;
  // Remove classes
  s = s.replace(/\.[\w-]+|\[.*?\]|:[\w-]+/g, "");
  // Count elements
  const elements = s.match(/\b[a-zA-Z][\w-]*/g);
  d += elements ? elements.length : 0;
  // Inline style
  if (selector.includes("style=")) a = 1;
  return [a, b, c, d];
}

export default function CSSSpecificity() {
  const [selectors, setSelectors] = useState([
    "div.container > p.active",
    "#header .nav a:hover",
    "body #content .article h2",
    "a",
    ".btn.btn-primary",
  ]);
  const [newSelector, setNewSelector] = useState("");

  const addSelector = () => {
    if (newSelector.trim()) {
      setSelectors([...selectors, newSelector.trim()]);
      setNewSelector("");
    }
  };

  const results = selectors.map((s) => ({
    selector: s,
    specificity: calculateSpecificity(s),
  }));

  const sorted = [...results].sort((a, b) => {
    for (let i = 0; i < 4; i++) {
      if (a.specificity[i] !== b.specificity[i]) return b.specificity[i] - a.specificity[i];
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">CSS Specificity Calculator</h1>
        <p className="text-[var(--text-secondary)]">
          Calculate and compare CSS selector specificity. Enter selectors and see which one wins. Free online CSS specificity tool.
        </p>
      </div>

      <div className="flex gap-2">
        <input
          value={newSelector}
          onChange={(e) => setNewSelector(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addSelector()}
          placeholder="Enter CSS selector..."
          className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-2 text-white font-mono text-sm"
        />
        <button onClick={addSelector} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-bold text-sm">Add</button>
      </div>

      <div className="space-y-2">
        {sorted.map((r, i) => {
          const [a, b, c, d] = r.specificity;
          const total = a * 1000 + b * 100 + c * 10 + d;
          const maxTotal = Math.max(...sorted.map((s) => s.specificity[0] * 1000 + s.specificity[1] * 100 + s.specificity[2] * 10 + s.specificity[3]));
          const barWidth = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
          const isWinner = i === 0;

          return (
            <div key={r.selector} className={`bg-[var(--bg-secondary)] border rounded-lg p-3 ${isWinner ? "border-emerald-500/50" : "border-[var(--border)]"}`}>
              <div className="flex items-center justify-between mb-1">
                <code className="text-sm font-mono text-white">{r.selector}</code>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-purple-400">{a},{b},{c},{d}</span>
                  {isWinner && <span className="text-xs text-emerald-400 font-bold">Winner</span>}
                  <button onClick={() => setSelectors(selectors.filter((s) => s !== r.selector))} className="text-xs text-gray-500 hover:text-red-400">✕</button>
                </div>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${isWinner ? "bg-emerald-500" : "bg-purple-500"}`} style={{ width: `${barWidth}%` }} />
              </div>
              <div className="flex gap-4 mt-1 text-[10px] text-gray-500">
                <span>Inline: {a}</span>
                <span>IDs: {b}</span>
                <span>Classes: {c}</span>
                <span>Elements: {d}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-xs text-[var(--text-secondary)]">
        <h3 className="font-bold text-white mb-2">How Specificity Works</h3>
        <div className="grid grid-cols-4 gap-2">
          <div><span className="text-white font-bold">a</span> — Inline styles (style="")</div>
          <div><span className="text-white font-bold">b</span> — ID selectors (#id)</div>
          <div><span className="text-white font-bold">c</span> — Classes, attributes, pseudo-classes</div>
          <div><span className="text-white font-bold">d</span> — Elements, pseudo-elements</div>
        </div>
        <p className="mt-2">Higher specificity wins. If equal, the last rule in the stylesheet wins.</p>
      </div>
    </div>
  );
}
