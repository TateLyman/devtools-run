"use client";
import { useState } from "react";

export default function PercentageCalculator() {
  const [a1, setA1] = useState("25");
  const [a2, setA2] = useState("200");
  const [b1, setB1] = useState("50");
  const [b2, setB2] = useState("");
  const [c1, setC1] = useState("200");
  const [c2, setC2] = useState("250");
  const [d1, setD1] = useState("80");
  const [d2, setD2] = useState("20");

  // What is X% of Y?
  const result1 = a1 && a2 ? ((parseFloat(a1) / 100) * parseFloat(a2)).toFixed(2) : "";

  // X is what % of Y?
  const result2 = b1 && b2 ? ((parseFloat(b1) / parseFloat(b2)) * 100).toFixed(2) : "";

  // % change from X to Y
  const result3 = c1 && c2 ? (((parseFloat(c2) - parseFloat(c1)) / parseFloat(c1)) * 100).toFixed(2) : "";

  // X + Y% = ?
  const result4 = d1 && d2 ? (parseFloat(d1) * (1 + parseFloat(d2) / 100)).toFixed(2) : "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Percentage Calculator</h1>
        <p className="text-[var(--text-secondary)]">
          Calculate percentages easily. What is X% of Y? Percentage change? Percentage increase? All common percentage calculations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-2">
          <h3 className="font-bold text-sm text-purple-400">What is X% of Y?</h3>
          <div className="flex items-center gap-2 text-sm">
            <span>What is</span>
            <input value={a1} onChange={(e) => setA1(e.target.value)} className="w-20 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-center font-mono" />
            <span>% of</span>
            <input value={a2} onChange={(e) => setA2(e.target.value)} className="w-24 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-center font-mono" />
            <span>?</span>
          </div>
          {result1 && <p className="text-lg font-bold text-emerald-400 font-mono">= {result1}</p>}
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-2">
          <h3 className="font-bold text-sm text-purple-400">X is what % of Y?</h3>
          <div className="flex items-center gap-2 text-sm">
            <input value={b1} onChange={(e) => setB1(e.target.value)} className="w-20 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-center font-mono" />
            <span>is what % of</span>
            <input value={b2} onChange={(e) => setB2(e.target.value)} className="w-24 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-center font-mono" />
            <span>?</span>
          </div>
          {result2 && <p className="text-lg font-bold text-emerald-400 font-mono">= {result2}%</p>}
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-2">
          <h3 className="font-bold text-sm text-purple-400">Percentage Change</h3>
          <div className="flex items-center gap-2 text-sm">
            <span>From</span>
            <input value={c1} onChange={(e) => setC1(e.target.value)} className="w-24 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-center font-mono" />
            <span>to</span>
            <input value={c2} onChange={(e) => setC2(e.target.value)} className="w-24 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-center font-mono" />
          </div>
          {result3 && (
            <p className={`text-lg font-bold font-mono ${parseFloat(result3) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              = {parseFloat(result3) >= 0 ? "+" : ""}{result3}%
            </p>
          )}
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-2">
          <h3 className="font-bold text-sm text-purple-400">Add Percentage</h3>
          <div className="flex items-center gap-2 text-sm">
            <input value={d1} onChange={(e) => setD1(e.target.value)} className="w-24 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-center font-mono" />
            <span>+</span>
            <input value={d2} onChange={(e) => setD2(e.target.value)} className="w-20 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-center font-mono" />
            <span>%</span>
          </div>
          {result4 && <p className="text-lg font-bold text-emerald-400 font-mono">= {result4}</p>}
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-sm">
        <h3 className="font-bold text-white mb-2">Common Percentages Quick Reference</h3>
        <div className="grid grid-cols-5 gap-2 text-xs text-center">
          {[5, 10, 15, 20, 25, 30, 33, 40, 50, 75].map((p) => (
            <div key={p} className="bg-[var(--bg-primary)] rounded py-2">
              <div className="text-gray-400">{p}% of {a2 || "100"}</div>
              <div className="text-white font-mono font-bold">{((p / 100) * parseFloat(a2 || "100")).toFixed(1)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
