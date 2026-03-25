"use client";
import { useState, useMemo } from "react";

export default function CompoundInterest() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);
  const [contribution, setContribution] = useState(200);
  const [frequency, setFrequency] = useState<"monthly" | "yearly">("monthly");

  const result = useMemo(() => {
    const r = rate / 100;
    const n = frequency === "monthly" ? 12 : 1;
    const periodicRate = r / n;
    const totalPeriods = years * n;
    const contribPerPeriod = contribution;

    let balance = principal;
    const yearlyData: { year: number; balance: number; contributions: number; interest: number }[] = [];
    let totalContributions = principal;

    for (let period = 1; period <= totalPeriods; period++) {
      const interest = balance * periodicRate;
      balance += interest + contribPerPeriod;
      totalContributions += contribPerPeriod;

      if (frequency === "monthly" && period % 12 === 0) {
        yearlyData.push({
          year: period / 12,
          balance: Math.round(balance),
          contributions: Math.round(totalContributions),
          interest: Math.round(balance - totalContributions),
        });
      } else if (frequency === "yearly") {
        yearlyData.push({
          year: period,
          balance: Math.round(balance),
          contributions: Math.round(totalContributions),
          interest: Math.round(balance - totalContributions),
        });
      }
    }

    return {
      finalBalance: Math.round(balance),
      totalContributions: Math.round(totalContributions),
      totalInterest: Math.round(balance - totalContributions),
      yearlyData,
    };
  }, [principal, rate, years, contribution, frequency]);

  const fmt = (n: number) => "$" + n.toLocaleString();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Compound Interest Calculator</h1>
        <p className="text-[var(--text-secondary)]">
          See how your money grows with compound interest. Add monthly or yearly contributions. Free investment calculator.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <label>Initial Investment</label>
              <span className="text-white font-mono">{fmt(principal)}</span>
            </div>
            <input type="range" min={0} max={100000} step={1000} value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full accent-purple-500" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <label>{frequency === "monthly" ? "Monthly" : "Yearly"} Contribution</label>
              <span className="text-white font-mono">{fmt(contribution)}</span>
            </div>
            <input type="range" min={0} max={5000} step={50} value={contribution} onChange={(e) => setContribution(Number(e.target.value))} className="w-full accent-purple-500" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <label>Annual Interest Rate</label>
              <span className="text-white font-mono">{rate}%</span>
            </div>
            <input type="range" min={0} max={20} step={0.5} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-purple-500" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <label>Time Period</label>
              <span className="text-white font-mono">{years} years</span>
            </div>
            <input type="range" min={1} max={50} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-purple-500" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setFrequency("monthly")} className={`flex-1 py-1.5 rounded text-sm ${frequency === "monthly" ? "bg-purple-600 text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"}`}>Monthly</button>
            <button onClick={() => setFrequency("yearly")} className={`flex-1 py-1.5 rounded text-sm ${frequency === "yearly" ? "bg-purple-600 text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"}`}>Yearly</button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6 text-center">
            <p className="text-xs text-gray-400 mb-1">Final Balance</p>
            <p className="text-4xl font-bold text-emerald-400">{fmt(result.finalBalance)}</p>
            <p className="text-xs text-gray-500 mt-1">after {years} years</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-center">
              <p className="text-xs text-gray-400">Total Contributed</p>
              <p className="text-lg font-bold text-purple-400">{fmt(result.totalContributions)}</p>
            </div>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-center">
              <p className="text-xs text-gray-400">Interest Earned</p>
              <p className="text-lg font-bold text-emerald-400">{fmt(result.totalInterest)}</p>
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <h3 className="font-bold text-sm mb-2">Growth by Year</h3>
            <div className="max-h-48 overflow-auto text-xs">
              <table className="w-full">
                <thead className="text-gray-400">
                  <tr><th className="text-left py-1">Year</th><th className="text-right">Balance</th><th className="text-right">Contributed</th><th className="text-right">Interest</th></tr>
                </thead>
                <tbody>
                  {result.yearlyData.map((d) => (
                    <tr key={d.year} className="border-t border-[var(--border)]">
                      <td className="py-1">{d.year}</td>
                      <td className="text-right text-white font-mono">{fmt(d.balance)}</td>
                      <td className="text-right text-purple-400 font-mono">{fmt(d.contributions)}</td>
                      <td className="text-right text-emerald-400 font-mono">{fmt(d.interest)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
