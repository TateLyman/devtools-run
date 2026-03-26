"use client";
import { useState } from "react";

const BRACKETS: Record<string, [number, number][]> = {
  single: [[11600, 0.10], [47150, 0.12], [100525, 0.22], [191950, 0.24], [243725, 0.32], [609350, 0.35], [Infinity, 0.37]],
  joint: [[23200, 0.10], [94300, 0.12], [201050, 0.22], [383900, 0.24], [487450, 0.32], [731200, 0.35], [Infinity, 0.37]],
  separate: [[11600, 0.10], [47150, 0.12], [100525, 0.22], [191950, 0.24], [243725, 0.32], [365600, 0.35], [Infinity, 0.37]],
  head: [[16550, 0.10], [63100, 0.12], [100500, 0.22], [191950, 0.24], [243700, 0.32], [609350, 0.35], [Infinity, 0.37]],
};

const DEDUCTIONS: Record<string, number> = { single: 14600, joint: 29200, separate: 14600, head: 21900 };
const LABELS: Record<string, string> = { single: "Single", joint: "Married Filing Jointly", separate: "Married Filing Separately", head: "Head of Household" };

function calcTax(taxable: number, brackets: [number, number][]): { total: number; breakdown: { rate: number; amount: number; rangeEnd: number }[] } {
  let remaining = Math.max(taxable, 0);
  let prev = 0;
  const breakdown: { rate: number; amount: number; rangeEnd: number }[] = [];
  let total = 0;
  for (const [limit, rate] of brackets) {
    const range = Math.min(remaining, limit - prev);
    if (range <= 0) { breakdown.push({ rate, amount: 0, rangeEnd: limit }); prev = limit; continue; }
    const tax = range * rate;
    total += tax;
    breakdown.push({ rate, amount: tax, rangeEnd: limit });
    remaining -= range;
    prev = limit;
    if (remaining <= 0) break;
  }
  return { total, breakdown };
}

export default function TaxCalc() {
  const [income, setIncome] = useState("75000");
  const [filing, setFiling] = useState("single");
  const [useCustom, setUseCustom] = useState(false);
  const [customDeduction, setCustomDeduction] = useState("");

  const gross = parseFloat(income) || 0;
  const deduction = useCustom ? (parseFloat(customDeduction) || 0) : DEDUCTIONS[filing];
  const taxable = Math.max(gross - deduction, 0);
  const { total: tax, breakdown } = calcTax(taxable, BRACKETS[filing]);
  const effective = gross > 0 ? (tax / gross * 100) : 0;
  const marginal = breakdown.findLast(b => b.amount > 0)?.rate ?? 0;
  const afterTax = gross - tax;

  const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Income Tax Calculator</h1>
        <p className="text-[var(--text-secondary)]">2025 Federal Tax Brackets</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-[var(--text-secondary)] block mb-1">Gross Annual Income</label>
            <input value={income} onChange={e => setIncome(e.target.value)} type="number" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-lg" />
          </div>
          <div>
            <label className="text-sm text-[var(--text-secondary)] block mb-1">Filing Status</label>
            <select value={filing} onChange={e => setFiling(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2">
              {Object.entries(LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <input type="checkbox" id="custom" checked={useCustom} onChange={e => setUseCustom(e.target.checked)} />
          <label htmlFor="custom" className="text-sm text-[var(--text-secondary)]">Custom deduction</label>
          {useCustom && <input value={customDeduction} onChange={e => setCustomDeduction(e.target.value)} type="number" placeholder={DEDUCTIONS[filing].toString()} className="w-32 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-2 py-1 text-sm font-mono" />}
          {!useCustom && <span className="text-xs text-[var(--text-secondary)]">Standard: {fmt(DEDUCTIONS[filing])}</span>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Federal Tax", value: fmt(tax), color: "text-red-400" },
          { label: "Effective Rate", value: effective.toFixed(2) + "%", color: "text-yellow-400" },
          { label: "Marginal Rate", value: (marginal * 100).toFixed(0) + "%", color: "text-orange-400" },
          { label: "After-Tax Income", value: fmt(afterTax), color: "text-emerald-400" },
        ].map((c, i) => (
          <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center">
            <div className="text-xs text-[var(--text-secondary)] mb-1">{c.label}</div>
            <div className={`text-xl font-bold ${c.color}`}>{c.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-3">Tax Bracket Breakdown</h2>
        <div className="space-y-2">
          {breakdown.filter(b => b.amount > 0 || breakdown.indexOf(b) === 0).map((b, i) => {
            const prev = i === 0 ? 0 : BRACKETS[filing][i - 1][0];
            const pct = tax > 0 ? (b.amount / tax * 100) : 0;
            return (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{(b.rate * 100).toFixed(0)}% bracket ({fmt(prev)} - {b.rangeEnd === Infinity ? "+" : fmt(b.rangeEnd)})</span>
                  <span className="font-mono">{fmt(b.amount)}</span>
                </div>
                <div className="w-full bg-[var(--bg-primary)] rounded-full h-2">
                  <div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-3">Take-Home Pay</h2>
        <div className="grid gap-4 md:grid-cols-4 text-center">
          {[
            { label: "Annual", value: fmt(afterTax) },
            { label: "Monthly", value: fmt(afterTax / 12) },
            { label: "Bi-Weekly", value: fmt(afterTax / 26) },
            { label: "Weekly", value: fmt(afterTax / 52) },
          ].map(p => (
            <div key={p.label}>
              <div className="text-xs text-[var(--text-secondary)]">{p.label}</div>
              <div className="text-lg font-bold font-mono text-emerald-400">{p.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
