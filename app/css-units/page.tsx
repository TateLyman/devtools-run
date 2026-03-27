"use client";
import { useState } from "react";
export default function CSSUnits() {
  const [val, setVal] = useState("16");
  const [from, setFrom] = useState("px");
  const [base, setBase] = useState(16);
  const [vw, setVw] = useState(1920);
  const v = parseFloat(val) || 0;
  const toPx = from === "px" ? v : from === "rem" ? v * base : from === "em" ? v * base : from === "pt" ? v * 1.333 : from === "vw" ? v * vw / 100 : from === "vh" ? v * 1080 / 100 : from === "cm" ? v * 37.795 : from === "mm" ? v * 3.7795 : from === "in" ? v * 96 : v;
  const units = [
    ["px", toPx.toFixed(2)], ["rem", (toPx / base).toFixed(4)], ["em", (toPx / base).toFixed(4)],
    ["pt", (toPx / 1.333).toFixed(2)], ["vw", (toPx / vw * 100).toFixed(4)],
    ["cm", (toPx / 37.795).toFixed(4)], ["mm", (toPx / 3.7795).toFixed(3)], ["in", (toPx / 96).toFixed(4)],
  ];
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">CSS Unit Converter</h1></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 flex gap-2 items-end justify-center">
        <input value={val} onChange={e => setVal(e.target.value)} type="number" className="w-32 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-xl" />
        <select value={from} onChange={e => setFrom(e.target.value)} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2">{["px","rem","em","pt","vw","vh","cm","mm","in"].map(u => <option key={u}>{u}</option>)}</select>
        <div className="text-xs text-[var(--text-secondary)]">Base: <input type="number" value={base} onChange={e => setBase(Number(e.target.value))} className="w-12 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-1 text-xs" />px</div>
      </div>
      <div className="grid gap-2 md:grid-cols-2">{units.map(([u, v]) => (<div key={u} onClick={() => navigator.clipboard.writeText(`${v}${u}`)} className={`flex justify-between bg-[var(--bg-secondary)] border rounded-xl px-4 py-3 cursor-pointer hover:border-blue-500/50 ${u === from ? "border-blue-500" : "border-[var(--border)]"}`}><span className="font-bold">{u}</span><code className="font-mono">{v}</code></div>))}</div>
    </div>
  );
}
