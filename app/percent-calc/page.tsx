"use client";
import { useState } from "react";

export default function PercentCalc() {
  const [a1, setA1] = useState("25"); const [b1, setB1] = useState("200");
  const [a2, setA2] = useState("50"); const [b2, setB2] = useState("200");
  const [from, setFrom] = useState("100"); const [to, setTo] = useState("150");
  const [orig, setOrig] = useState("80"); const [pct, setPct] = useState("20");

  const r1 = (parseFloat(a1) / 100) * parseFloat(b1);
  const r2 = (parseFloat(a2) / parseFloat(b2)) * 100;
  const change = ((parseFloat(to) - parseFloat(from)) / parseFloat(from)) * 100;
  const increased = parseFloat(orig) * (1 + parseFloat(pct) / 100);
  const decreased = parseFloat(orig) * (1 - parseFloat(pct) / 100);

  const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
      <h2 className="font-bold text-lg mb-4">{title}</h2>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Percentage Calculator</h1>
        <p className="text-[var(--text-secondary)]">Calculate percentages quickly</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="What is X% of Y?">
          <div className="flex items-center gap-2 flex-wrap">
            <span>What is</span>
            <input value={a1} onChange={e => setA1(e.target.value)} type="number" className="w-20 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono" />
            <span>% of</span>
            <input value={b1} onChange={e => setB1(e.target.value)} type="number" className="w-20 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono" />
            <span>=</span>
            <span className="text-xl font-bold text-emerald-400">{isNaN(r1) ? "—" : r1.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
        </Card>

        <Card title="X is what % of Y?">
          <div className="flex items-center gap-2 flex-wrap">
            <input value={a2} onChange={e => setA2(e.target.value)} type="number" className="w-20 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono" />
            <span>is what % of</span>
            <input value={b2} onChange={e => setB2(e.target.value)} type="number" className="w-20 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono" />
            <span>=</span>
            <span className="text-xl font-bold text-emerald-400">{isNaN(r2) ? "—" : r2.toFixed(2)}%</span>
          </div>
        </Card>

        <Card title="Percentage Change">
          <div className="flex items-center gap-2 flex-wrap">
            <span>From</span>
            <input value={from} onChange={e => setFrom(e.target.value)} type="number" className="w-20 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono" />
            <span>to</span>
            <input value={to} onChange={e => setTo(e.target.value)} type="number" className="w-20 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono" />
            <span>=</span>
            <span className={`text-xl font-bold ${change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {isNaN(change) ? "—" : (change >= 0 ? "+" : "") + change.toFixed(2)}%
            </span>
          </div>
        </Card>

        <Card title="Increase / Decrease">
          <div className="flex items-center gap-2 flex-wrap">
            <input value={orig} onChange={e => setOrig(e.target.value)} type="number" className="w-20 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono" />
            <span>±</span>
            <input value={pct} onChange={e => setPct(e.target.value)} type="number" className="w-20 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 font-mono" />
            <span>%</span>
          </div>
          <div className="mt-2 flex gap-4 text-sm">
            <span>+{pct}% = <strong className="text-emerald-400">{isNaN(increased) ? "—" : increased.toFixed(2)}</strong></span>
            <span>-{pct}% = <strong className="text-red-400">{isNaN(decreased) ? "—" : decreased.toFixed(2)}</strong></span>
          </div>
        </Card>
      </div>
    </div>
  );
}
