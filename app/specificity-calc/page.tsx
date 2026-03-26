"use client";
import { useState } from "react";

function calcSpecificity(selector: string): [number, number, number] {
  let a = 0, b = 0, c = 0;
  const cleaned = selector.replace(/:not\(([^)]*)\)/g, "$1").replace(/::[\w-]+/g, "").replace(/\s+/g, " ").trim();
  const ids = cleaned.match(/#[\w-]+/g);
  const classes = cleaned.match(/\.[\w-]+/g);
  const attrs = cleaned.match(/\[[\w-]+(=[^\]]+)?\]/g);
  const pseudoClasses = cleaned.match(/:[\w-]+/g);
  const elements = cleaned.replace(/#[\w-]+/g, "").replace(/\.[\w-]+/g, "").replace(/\[[\w-]+(=[^\]]+)?\]/g, "").replace(/:[\w-]+/g, "").replace(/[>+~ ]/g, " ").trim().split(/\s+/).filter(s => s && s !== "*");
  a = ids?.length || 0;
  b = (classes?.length || 0) + (attrs?.length || 0) + (pseudoClasses?.length || 0);
  c = elements.length;
  return [a, b, c];
}

export default function SpecificityCalc() {
  const [selectors, setSelectors] = useState(["#header .nav a", ".nav a:hover", "div#main .content p", "a"]);

  const addSelector = () => setSelectors([...selectors, ""]);
  const updateSelector = (i: number, v: string) => { const s = [...selectors]; s[i] = v; setSelectors(s); };
  const removeSelector = (i: number) => setSelectors(selectors.filter((_, j) => j !== i));

  const results = selectors.map(s => ({ selector: s, spec: calcSpecificity(s) })).sort((a, b) => {
    if (a.spec[0] !== b.spec[0]) return b.spec[0] - a.spec[0];
    if (a.spec[1] !== b.spec[1]) return b.spec[1] - a.spec[1];
    return b.spec[2] - a.spec[2];
  });

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">CSS Specificity Calculator</h1>
        <p className="text-[var(--text-secondary)]">Calculate and compare CSS selector specificity</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 space-y-2">
        {selectors.map((s, i) => (
          <div key={i} className="flex gap-2">
            <input value={s} onChange={e => updateSelector(i, e.target.value)} placeholder="Enter CSS selector"
              className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-sm" />
            {selectors.length > 1 && <button onClick={() => removeSelector(i)} className="text-red-400 text-sm px-2">x</button>}
          </div>
        ))}
        <button onClick={addSelector} className="text-sm text-blue-400">+ Add Selector</button>
      </div>

      <div className="space-y-2">
        {results.map(({ selector, spec }, i) => (
          <div key={i} className={`bg-[var(--bg-secondary)] border rounded-xl p-4 flex justify-between items-center ${i === 0 ? "border-emerald-500/50" : "border-[var(--border)]"}`}>
            <div>
              {i === 0 && <span className="text-xs text-emerald-400 font-bold mr-2">WINNER</span>}
              <code className="font-mono text-sm">{selector || "(empty)"}</code>
            </div>
            <div className="flex gap-1 font-mono">
              <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-sm font-bold" title="IDs">{spec[0]}</span>
              <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-sm font-bold" title="Classes">{spec[1]}</span>
              <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm font-bold" title="Elements">{spec[2]}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-sm">
        <h2 className="font-bold mb-2">How Specificity Works</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-red-500/10 rounded-lg p-3"><span className="font-bold text-red-400">A (IDs)</span><p className="text-xs text-[var(--text-secondary)]">#header, #nav — Each ID = +1,0,0</p></div>
          <div className="bg-yellow-500/10 rounded-lg p-3"><span className="font-bold text-yellow-400">B (Classes)</span><p className="text-xs text-[var(--text-secondary)]">.nav, :hover, [type] — Each = +0,1,0</p></div>
          <div className="bg-blue-500/10 rounded-lg p-3"><span className="font-bold text-blue-400">C (Elements)</span><p className="text-xs text-[var(--text-secondary)]">div, p, a — Each element = +0,0,1</p></div>
        </div>
      </div>
    </div>
  );
}
