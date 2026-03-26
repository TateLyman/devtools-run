"use client";
import { useState } from "react";

export default function FlexboxPlayground() {
  const [dir, setDir] = useState("row");
  const [wrap, setWrap] = useState("nowrap");
  const [justify, setJustify] = useState("flex-start");
  const [alignItems, setAlignItems] = useState("stretch");
  const [alignContent, setAlignContent] = useState("stretch");
  const [gap, setGap] = useState("8");
  const [items, setItems] = useState(5);

  const css = `display: flex;\nflex-direction: ${dir};\nflex-wrap: ${wrap};\njustify-content: ${justify};\nalign-items: ${alignItems};${alignContent !== "stretch" ? `\nalign-content: ${alignContent};` : ""}\ngap: ${gap}px;`;

  const copy = () => navigator.clipboard.writeText(css);

  const Select = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
    <div>
      <label className="text-xs text-[var(--text-secondary)] block mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-sm">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Flexbox Playground</h1>
        <p className="text-[var(--text-secondary)]">Visual CSS Flexbox generator</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 min-h-[200px]"
        style={{ display: "flex", flexDirection: dir as any, flexWrap: wrap as any, justifyContent: justify, alignItems, alignContent, gap: `${gap}px` }}>
        {Array.from({ length: items }, (_, i) => (
          <div key={i} className="bg-blue-600 text-white rounded-lg px-4 py-3 font-bold text-sm flex items-center justify-center"
            style={{ minWidth: "60px", minHeight: "40px" }}>
            {i + 1}
          </div>
        ))}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="grid gap-3 md:grid-cols-3">
          <Select label="flex-direction" value={dir} onChange={setDir} options={["row","row-reverse","column","column-reverse"]} />
          <Select label="flex-wrap" value={wrap} onChange={setWrap} options={["nowrap","wrap","wrap-reverse"]} />
          <Select label="justify-content" value={justify} onChange={setJustify} options={["flex-start","flex-end","center","space-between","space-around","space-evenly"]} />
          <Select label="align-items" value={alignItems} onChange={setAlignItems} options={["stretch","flex-start","flex-end","center","baseline"]} />
          <Select label="align-content" value={alignContent} onChange={setAlignContent} options={["stretch","flex-start","flex-end","center","space-between","space-around"]} />
          <div>
            <label className="text-xs text-[var(--text-secondary)] block mb-1">gap: {gap}px</label>
            <input type="range" min={0} max={40} value={gap} onChange={e => setGap(e.target.value)} className="w-full" />
          </div>
        </div>
        <div className="mt-3">
          <label className="text-xs text-[var(--text-secondary)]">Items: {items}</label>
          <input type="range" min={1} max={12} value={items} onChange={e => setItems(Number(e.target.value))} className="w-full" />
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
