"use client";
import { useState } from "react";
function calc(sel: string): [number,number,number] {
  let a=0,b=0,c=0;
  const s = sel.replace(/:not\(([^)]*)\)/g,"$1").replace(/::[\w-]+/g,"");
  a = (s.match(/#[\w-]+/g)||[]).length;
  b = (s.match(/\.[\w-]+/g)||[]).length + (s.match(/\[[\w-]+(=[^\]]+)?\]/g)||[]).length + (s.match(/:[\w-]+/g)||[]).length;
  c = s.replace(/#[\w-]+/g,"").replace(/\.[\w-]+/g,"").replace(/\[[\w-]+(=[^\]]+)?\]/g,"").replace(/:[\w-]+/g,"").replace(/[>+~ ]/g," ").trim().split(/\s+/).filter(x => x && x !== "*").length;
  return [a,b,c];
}
export default function SpecificityViz() {
  const [selectors, setSelectors] = useState(["#header .nav a", ".nav a:hover", "div.content p.intro", "body #main .sidebar a.active:first-child"]);
  const results = selectors.map(s => ({ sel: s, spec: calc(s), score: calc(s)[0]*100+calc(s)[1]*10+calc(s)[2] })).sort((a,b) => b.score - a.score);
  const maxScore = results[0]?.score || 1;
  const add = () => setSelectors([...selectors, ""]);
  const update = (i: number, v: string) => { const s = [...selectors]; s[i] = v; setSelectors(s); };
  const remove = (i: number) => setSelectors(selectors.filter((_,j) => j !== i));
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">CSS Specificity Visualizer</h1><p className="text-[var(--text-secondary)]">Compare selectors — highest specificity wins</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 space-y-2">
        {selectors.map((s, i) => (<div key={i} className="flex gap-2"><input value={s} onChange={e => update(i, e.target.value)} className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-sm" placeholder="CSS selector" />{selectors.length > 1 && <button onClick={() => remove(i)} className="text-red-400 text-sm px-2">x</button>}</div>))}
        <button onClick={add} className="text-sm text-blue-400">+ Add selector</button>
      </div>
      <div className="space-y-2">
        {results.map(({ sel, spec, score }, i) => (
          <div key={i} className={`bg-[var(--bg-secondary)] border rounded-xl p-4 ${i === 0 ? "border-emerald-500/50" : "border-[var(--border)]"}`}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                {i === 0 && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">WINS</span>}
                <code className="font-mono text-sm">{sel || "(empty)"}</code>
              </div>
              <div className="flex gap-1 font-mono text-sm">
                <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded font-bold">{spec[0]}</span>
                <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded font-bold">{spec[1]}</span>
                <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded font-bold">{spec[2]}</span>
              </div>
            </div>
            <div className="w-full bg-[var(--bg-primary)] rounded-full h-2"><div className={`h-2 rounded-full ${i === 0 ? "bg-emerald-500" : "bg-blue-500/50"}`} style={{ width: `${(score / maxScore) * 100}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-sm grid md:grid-cols-3 gap-3">
        <div className="bg-red-500/10 rounded-lg p-3"><span className="font-bold text-red-400">A (IDs)</span><p className="text-xs text-[var(--text-secondary)]">#header, #nav — highest weight</p></div>
        <div className="bg-yellow-500/10 rounded-lg p-3"><span className="font-bold text-yellow-400">B (Classes)</span><p className="text-xs text-[var(--text-secondary)]">.nav, :hover, [type] — medium weight</p></div>
        <div className="bg-blue-500/10 rounded-lg p-3"><span className="font-bold text-blue-400">C (Elements)</span><p className="text-xs text-[var(--text-secondary)]">div, p, a — lowest weight</p></div>
      </div>
    </div>
  );
}
