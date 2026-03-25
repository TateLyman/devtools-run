"use client";
import { useState, useMemo } from "react";

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(6.5);
  const [propertyTax, setPropertyTax] = useState(3600);
  const [insurance, setInsurance] = useState(1200);

  const calc = useMemo(() => {
    const principal = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    if (monthlyRate === 0) {
      const monthlyPrincipal = principal / numPayments;
      return {
        monthlyPayment: monthlyPrincipal + propertyTax / 12 + insurance / 12,
        monthlyPrincipal,
        totalPayment: monthlyPrincipal * numPayments,
        totalInterest: 0,
        principal,
      };
    }

    const monthlyPrincipal = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalPayment = monthlyPrincipal * numPayments;
    const totalInterest = totalPayment - principal;

    return {
      monthlyPayment: monthlyPrincipal + propertyTax / 12 + insurance / 12,
      monthlyPrincipal,
      totalPayment,
      totalInterest,
      principal,
    };
  }, [homePrice, downPayment, loanTerm, interestRate, propertyTax, insurance]);

  const downPaymentPercent = homePrice > 0 ? Math.round((downPayment / homePrice) * 100) : 0;

  const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtD = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Mortgage Calculator</h1>
        <p className="text-[var(--text-secondary)]">
          Calculate your monthly mortgage payment, total interest, and amortization. Includes property tax and insurance estimates.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <label>Home Price</label>
                <span className="text-white font-mono">{fmt(homePrice)}</span>
              </div>
              <input type="range" min={50000} max={2000000} step={5000} value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <label>Down Payment ({downPaymentPercent}%)</label>
                <span className="text-white font-mono">{fmt(downPayment)}</span>
              </div>
              <input type="range" min={0} max={homePrice} step={5000} value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <label>Loan Term</label>
                <span className="text-white font-mono">{loanTerm} years</span>
              </div>
              <div className="flex gap-2">
                {[15, 20, 30].map((t) => (
                  <button key={t} onClick={() => setLoanTerm(t)} className={`flex-1 py-1.5 rounded text-sm ${loanTerm === t ? "bg-purple-600 text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"}`}>{t} yr</button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <label>Interest Rate</label>
                <span className="text-white font-mono">{interestRate}%</span>
              </div>
              <input type="range" min={0} max={15} step={0.125} value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Property Tax / yr</label>
                <input type="number" value={propertyTax} onChange={(e) => setPropertyTax(Number(e.target.value))} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Insurance / yr</label>
                <input type="number" value={insurance} onChange={(e) => setInsurance(Number(e.target.value))} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6 text-center">
            <p className="text-xs text-gray-400 mb-1">Monthly Payment</p>
            <p className="text-4xl font-bold text-purple-400">{fmtD(calc.monthlyPayment)}</p>
            <p className="text-xs text-gray-500 mt-1">/month</p>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <h3 className="font-bold text-sm">Payment Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Principal & Interest</span>
                <span className="text-white font-mono">{fmtD(calc.monthlyPrincipal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Property Tax</span>
                <span className="text-white font-mono">{fmtD(propertyTax / 12)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Insurance</span>
                <span className="text-white font-mono">{fmtD(insurance / 12)}</span>
              </div>
              <div className="flex justify-between border-t border-[var(--border)] pt-2 font-bold">
                <span>Total Monthly</span>
                <span className="text-purple-400">{fmtD(calc.monthlyPayment)}</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-2">
            <h3 className="font-bold text-sm">Loan Summary</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-400">Loan Amount</p>
                <p className="text-white font-bold">{fmt(calc.principal)}</p>
              </div>
              <div>
                <p className="text-gray-400">Down Payment</p>
                <p className="text-white font-bold">{fmt(downPayment)} ({downPaymentPercent}%)</p>
              </div>
              <div>
                <p className="text-gray-400">Total Interest</p>
                <p className="text-red-400 font-bold">{fmt(calc.totalInterest)}</p>
              </div>
              <div>
                <p className="text-gray-400">Total Cost</p>
                <p className="text-white font-bold">{fmt(calc.totalPayment + downPayment)}</p>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex h-4 rounded-full overflow-hidden">
                <div className="bg-purple-500" style={{ width: `${(calc.principal / (calc.totalPayment + downPayment)) * 100}%` }} title="Principal" />
                <div className="bg-red-500" style={{ width: `${(calc.totalInterest / (calc.totalPayment + downPayment)) * 100}%` }} title="Interest" />
                <div className="bg-emerald-500" style={{ width: `${(downPayment / (calc.totalPayment + downPayment)) * 100}%` }} title="Down Payment" />
              </div>
              <div className="flex justify-between text-xs mt-1 text-gray-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-purple-500 inline-block" /> Principal</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-500 inline-block" /> Interest</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500 inline-block" /> Down</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
