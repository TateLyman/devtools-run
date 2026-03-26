"use client";
import { useState } from "react";

const ROMAN_MAP: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
  [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

function toRoman(n: number): string {
  if (n < 1 || n > 3999) return "Out of range (1-3999)";
  let result = "";
  for (const [value, symbol] of ROMAN_MAP) {
    while (n >= value) { result += symbol; n -= value; }
  }
  return result;
}

function fromRoman(s: string): number {
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let result = 0;
  const upper = s.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    const curr = map[upper[i]] || 0;
    const next = map[upper[i + 1]] || 0;
    if (curr < next) { result -= curr; } else { result += curr; }
  }
  return result;
}

export default function RomanConverter() {
  const [number, setNumber] = useState("2026");
  const [roman, setRoman] = useState("MMXXVI");
  const [mode, setMode] = useState<"toRoman" | "fromRoman">("toRoman");

  const handleNumber = (v: string) => { setNumber(v); const n = parseInt(v); if (n >= 1 && n <= 3999) setRoman(toRoman(n)); };
  const handleRoman = (v: string) => { setRoman(v.toUpperCase()); const n = fromRoman(v); if (n > 0) setNumber(n.toString()); };

  const copy = (t: string) => navigator.clipboard.writeText(t);

  const examples = [
    [1, "I"], [4, "IV"], [9, "IX"], [14, "XIV"], [40, "XL"], [50, "L"],
    [90, "XC"], [100, "C"], [400, "CD"], [500, "D"], [900, "CM"], [1000, "M"],
    [1776, "MDCCLXXVI"], [1999, "MCMXCIX"], [2024, "MMXXIV"], [2026, "MMXXVI"], [3999, "MMMCMXCIX"],
  ];

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Roman Numeral Converter</h1>
        <p className="text-[var(--text-secondary)]">Convert between numbers and Roman numerals</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
          <label className="text-sm font-bold block mb-2">Number (1-3999)</label>
          <input value={number} onChange={e => handleNumber(e.target.value)} type="number" min={1} max={3999}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-3 font-mono text-2xl text-center" />
          <button onClick={() => copy(number)} className="text-xs text-blue-400 mt-2 block mx-auto">Copy</button>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
          <label className="text-sm font-bold block mb-2">Roman Numeral</label>
          <input value={roman} onChange={e => handleRoman(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-3 font-mono text-2xl text-center tracking-wider" />
          <button onClick={() => copy(roman)} className="text-xs text-blue-400 mt-2 block mx-auto">Copy</button>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-3">Reference Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[var(--text-secondary)] border-b border-[var(--border)]">
              <th className="py-2 pr-4">Number</th><th className="py-2">Roman</th>
            </tr></thead>
            <tbody>
              {examples.map(([n, r]) => (
                <tr key={n as number} className={`border-b border-[var(--border)] ${String(n) === number ? "bg-blue-500/10 text-blue-400" : ""}`}>
                  <td className="py-1.5 pr-4 font-mono">{n as number}</td>
                  <td className="py-1.5 font-mono tracking-wider">{r as string}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-3">How Roman Numerals Work</h2>
        <div className="grid gap-2 md:grid-cols-2 text-sm text-[var(--text-secondary)]">
          <div>
            <p className="mb-2"><strong className="text-white">Basic symbols:</strong> I=1, V=5, X=10, L=50, C=100, D=500, M=1000</p>
            <p><strong className="text-white">Subtractive notation:</strong> A smaller value before a larger one means subtract (IV=4, IX=9, XL=40, XC=90, CD=400, CM=900)</p>
          </div>
          <div>
            <p className="mb-2"><strong className="text-white">Maximum:</strong> 3999 (MMMCMXCIX)</p>
            <p><strong className="text-white">Rule:</strong> Never more than 3 of the same symbol in a row</p>
          </div>
        </div>
      </div>
    </div>
  );
}
