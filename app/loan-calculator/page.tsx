"use client";
import { useState, useMemo } from "react";

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(25000);
  const [rate, setRate] = useState(7.5);
  const [term, setTerm] = useState(5);

  const result = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;

    if (monthlyRate === 0) {
      const monthly = loanAmount / numPayments;
      return { monthly, totalPaid: loanAmount, totalInterest: 0 };
    }

    const monthly = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalPaid = monthly * numPayments;
    const totalInterest = totalPaid - loanAmount;

    return { monthly, totalPaid, totalInterest };
  }, [loanAmount, rate, term]);

  const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Loan Calculator</h1>
        <p className="text-[var(--text-secondary)]">
          Calculate monthly loan payments, total interest, and total cost. Works for auto loans, personal loans, and student loans.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <label>Loan Amount</label>
              <span className="text-white font-mono">${loanAmount.toLocaleString()}</span>
            </div>
            <input type="range" min={1000} max={500000} step={1000} value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full accent-purple-500" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <label>Interest Rate</label>
              <span className="text-white font-mono">{rate}%</span>
            </div>
            <input type="range" min={0} max={30} step={0.25} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-purple-500" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <label>Loan Term</label>
              <span className="text-white font-mono">{term} years</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 5, 7, 10, 15, 20, 30].map((t) => (
                <button key={t} onClick={() => setTerm(t)} className={`flex-1 py-1 rounded text-xs ${term === t ? "bg-purple-600 text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"}`}>{t}y</button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6 text-center">
          <p className="text-xs text-gray-400 mb-1">Monthly Payment</p>
          <p className="text-4xl font-bold text-purple-400">{fmt(result.monthly)}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400">Loan Amount</p>
            <p className="text-lg font-bold text-white">${loanAmount.toLocaleString()}</p>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400">Total Interest</p>
            <p className="text-lg font-bold text-red-400">{fmt(result.totalInterest)}</p>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400">Total Cost</p>
            <p className="text-lg font-bold text-white">{fmt(result.totalPaid)}</p>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex h-4 rounded-full overflow-hidden">
            <div className="bg-purple-500" style={{ width: `${(loanAmount / result.totalPaid) * 100}%` }} />
            <div className="bg-red-500" style={{ width: `${(result.totalInterest / result.totalPaid) * 100}%` }} />
          </div>
          <div className="flex justify-between text-xs mt-1 text-gray-400">
            <span>Principal ({((loanAmount / result.totalPaid) * 100).toFixed(0)}%)</span>
            <span>Interest ({((result.totalInterest / result.totalPaid) * 100).toFixed(0)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
