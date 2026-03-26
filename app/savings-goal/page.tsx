"use client";
import { useState } from "react";

export default function SavingsGoal() {
  const [goal, setGoal] = useState("10000");
  const [monthly, setMonthly] = useState("500");
  const [initial, setInitial] = useState("1000");
  const [rate, setRate] = useState("5");

  const g = parseFloat(goal) || 0;
  const m = parseFloat(monthly) || 0;
  const init = parseFloat(initial) || 0;
  const r = (parseFloat(rate) || 0) / 100 / 12;

  let months = 0;
  let balance = init;
  const data: number[] = [init];
  while (balance < g && months < 600) {
    balance = balance * (1 + r) + m;
    months++;
    data.push(Math.min(balance, g));
  }

  const years = Math.floor(months / 12);
  const remainMonths = months % 12;
  const totalContributed = init + m * months;
  const interestEarned = balance - totalContributed;

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Savings Goal Calculator</h1>
        <p className="text-[var(--text-secondary)]">How long until you reach your savings goal?</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="text-sm text-[var(--text-secondary)]">Savings Goal ($)</label><input value={goal} onChange={e => setGoal(e.target.value)} type="number" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono" /></div>
          <div><label className="text-sm text-[var(--text-secondary)]">Monthly Savings ($)</label><input value={monthly} onChange={e => setMonthly(e.target.value)} type="number" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono" /></div>
          <div><label className="text-sm text-[var(--text-secondary)]">Initial Savings ($)</label><input value={initial} onChange={e => setInitial(e.target.value)} type="number" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono" /></div>
          <div><label className="text-sm text-[var(--text-secondary)]">Annual Interest Rate (%)</label><input value={rate} onChange={e => setRate(e.target.value)} type="number" step="0.1" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono" /></div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/20 rounded-xl p-8 text-center">
        <div className="text-sm text-[var(--text-secondary)]">Time to Reach ${Number(goal).toLocaleString()}</div>
        <div className="text-4xl font-bold text-emerald-400 my-2">
          {months >= 600 ? "50+ years" : `${years > 0 ? `${years} year${years > 1 ? "s" : ""} ` : ""}${remainMonths} month${remainMonths !== 1 ? "s" : ""}`}
        </div>
        <div className="text-sm text-[var(--text-secondary)]">{months} total months</div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center">
          <div className="text-xs text-[var(--text-secondary)]">Total Contributed</div>
          <div className="text-xl font-bold">${totalContributed.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center">
          <div className="text-xs text-[var(--text-secondary)]">Interest Earned</div>
          <div className="text-xl font-bold text-emerald-400">${interestEarned.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center">
          <div className="text-xs text-[var(--text-secondary)]">Final Balance</div>
          <div className="text-xl font-bold text-blue-400">${balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>
      </div>
    </div>
  );
}
