"use client";
import { useState } from "react";

export default function SalaryCalculator() {
  const [salary, setSalary] = useState(75000);
  const [payFrequency, setPayFrequency] = useState<"annual" | "hourly">("annual");
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [state, setState] = useState("none");

  const annual = payFrequency === "annual" ? salary : salary * hoursPerWeek * 52;
  const hourly = payFrequency === "hourly" ? salary : salary / (hoursPerWeek * 52);
  const monthly = annual / 12;
  const biweekly = annual / 26;
  const weekly = annual / 52;
  const daily = annual / 260;

  // Federal tax brackets 2026 (simplified)
  const federalTax = (() => {
    let tax = 0;
    const brackets = [
      { max: 11600, rate: 0.10 },
      { max: 47150, rate: 0.12 },
      { max: 100525, rate: 0.22 },
      { max: 191950, rate: 0.24 },
      { max: 243725, rate: 0.32 },
      { max: 609350, rate: 0.35 },
      { max: Infinity, rate: 0.37 },
    ];
    let remaining = annual;
    let prev = 0;
    for (const bracket of brackets) {
      const taxable = Math.min(remaining, bracket.max - prev);
      tax += taxable * bracket.rate;
      remaining -= taxable;
      prev = bracket.max;
      if (remaining <= 0) break;
    }
    return tax;
  })();

  const fica = annual * 0.0765;
  const totalTax = federalTax + fica;
  const afterTax = annual - totalTax;
  const effectiveRate = annual > 0 ? (totalTax / annual) * 100 : 0;

  const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtD = (n: number) => "$" + n.toFixed(2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Salary Calculator</h1>
        <p className="text-[var(--text-secondary)]">
          Convert between annual, monthly, biweekly, weekly, daily, and hourly rates. Estimate federal tax and take-home pay.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
          <div className="flex gap-2">
            <button onClick={() => setPayFrequency("annual")} className={`px-3 py-1.5 rounded text-sm ${payFrequency === "annual" ? "bg-purple-600 text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"}`}>Annual Salary</button>
            <button onClick={() => setPayFrequency("hourly")} className={`px-3 py-1.5 rounded text-sm ${payFrequency === "hourly" ? "bg-purple-600 text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"}`}>Hourly Rate</button>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">$</span>
            <input type="number" value={salary} onChange={(e) => setSalary(Number(e.target.value))} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded pl-8 pr-3 py-2.5 text-white text-lg font-mono" min={0} />
          </div>
          {payFrequency === "hourly" && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">Hours per week: {hoursPerWeek}</label>
              <input type="range" min={1} max={60} value={hoursPerWeek} onChange={(e) => setHoursPerWeek(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Annual", value: fmt(annual) },
            { label: "Monthly", value: fmt(monthly) },
            { label: "Biweekly", value: fmt(biweekly) },
            { label: "Weekly", value: fmt(weekly) },
            { label: "Daily", value: fmt(daily) },
            { label: "Hourly", value: fmtD(hourly) },
          ].map((s) => (
            <div key={s.label} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-lg font-bold text-white font-mono">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-2">
          <h3 className="font-bold text-sm">Estimated Tax (US Federal)</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">Gross Income</span><span className="text-white font-mono">{fmt(annual)}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Federal Tax</span><span className="text-red-400 font-mono">-{fmt(federalTax)}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">FICA (SS + Medicare)</span><span className="text-red-400 font-mono">-{fmt(fica)}</span></div>
            <div className="flex justify-between border-t border-[var(--border)] pt-2 font-bold">
              <span className="text-emerald-400">Take-Home Pay</span>
              <span className="text-emerald-400 font-mono">{fmt(afterTax)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Effective Tax Rate</span>
              <span className="text-gray-400">{effectiveRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Monthly Take-Home</span>
              <span className="text-emerald-400 font-mono">{fmt(afterTax / 12)}</span>
            </div>
          </div>
          <p className="text-[10px] text-gray-600 mt-2">Estimate only. Does not include state tax, deductions, or credits. Consult a tax professional.</p>
        </div>
      </div>
    </div>
  );
}
