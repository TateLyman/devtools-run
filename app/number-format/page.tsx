"use client";
import { useState } from "react";
export default function NumberFormat() {
  const [num, setNum] = useState("1234567.89");
  const n = parseFloat(num) || 0;
  const formats = [
    ["Standard", n.toLocaleString()],
    ["USD", n.toLocaleString("en-US", { style: "currency", currency: "USD" })],
    ["EUR", n.toLocaleString("de-DE", { style: "currency", currency: "EUR" })],
    ["GBP", n.toLocaleString("en-GB", { style: "currency", currency: "GBP" })],
    ["Percent", (n / 100).toLocaleString("en-US", { style: "percent", maximumFractionDigits: 2 })],
    ["Scientific", n.toExponential(2)],
    ["Fixed (2)", n.toFixed(2)],
    ["Compact", Intl.NumberFormat("en", { notation: "compact" }).format(n)],
    ["Binary", Math.floor(n).toString(2)],
    ["Hex", Math.floor(n).toString(16).toUpperCase()],
    ["Octal", Math.floor(n).toString(8)],
  ];
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Number Formatter</h1></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><input value={num} onChange={e => setNum(e.target.value)} type="number" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-3 font-mono text-2xl text-center" /></div>
      <div className="space-y-1">{formats.map(([label, val]) => (<div key={label} onClick={() => navigator.clipboard.writeText(val)} className="flex justify-between bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2 cursor-pointer hover:border-blue-500/50"><span className="text-sm font-bold w-24">{label}</span><code className="font-mono text-sm">{val}</code></div>))}</div>
    </div>
  );
}
