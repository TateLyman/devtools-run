"use client";
import { useState } from "react";

const UNITS_DEC = [
  { name: "Bytes", factor: 1 },
  { name: "KB", factor: 1000 },
  { name: "MB", factor: 1e6 },
  { name: "GB", factor: 1e9 },
  { name: "TB", factor: 1e12 },
  { name: "PB", factor: 1e15 },
];

const UNITS_BIN = [
  { name: "Bytes", factor: 1 },
  { name: "KiB", factor: 1024 },
  { name: "MiB", factor: 1048576 },
  { name: "GiB", factor: 1073741824 },
  { name: "TiB", factor: 1099511627776 },
  { name: "PiB", factor: 1125899906842624 },
];

export default function DataSize() {
  const [value, setValue] = useState("1");
  const [unit, setUnit] = useState("GB");
  const [mode, setMode] = useState<"decimal" | "binary">("decimal");

  const units = mode === "decimal" ? UNITS_DEC : UNITS_BIN;
  const selected = units.find(u => u.name === unit) || units[0];
  const bytes = (parseFloat(value) || 0) * selected.factor;

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Data Size Converter</h1>
        <p className="text-[var(--text-secondary)]">Convert between bytes, KB, MB, GB, TB</p>
      </section>

      <div className="flex justify-center gap-2">
        {(["decimal", "binary"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} className={`px-4 py-2 rounded-lg text-sm font-bold capitalize ${mode === m ? "bg-blue-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>
            {m} {m === "decimal" ? "(KB=1000)" : "(KiB=1024)"}
          </button>
        ))}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-sm text-[var(--text-secondary)] block mb-1">Value</label>
            <input value={value} onChange={e => setValue(e.target.value)} type="number" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-2xl" />
          </div>
          <select value={unit} onChange={e => setUnit(e.target.value)} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-lg">
            {units.map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        {units.map(u => {
          const converted = bytes / u.factor;
          const formatted = converted < 0.01 && converted > 0 ? converted.toExponential(2) : converted.toLocaleString(undefined, { maximumFractionDigits: 4 });
          return (
            <div key={u.name} onClick={() => navigator.clipboard.writeText(formatted)}
              className={`flex justify-between items-center bg-[var(--bg-secondary)] border rounded-xl px-4 py-3 cursor-pointer hover:border-blue-500/50 ${u.name === unit ? "border-blue-500" : "border-[var(--border)]"}`}>
              <span className="font-bold">{u.name}</span>
              <span className="font-mono text-lg">{formatted}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
