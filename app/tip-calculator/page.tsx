"use client";
import { useState } from "react";

export default function TipCalculator() {
  const [bill, setBill] = useState(50);
  const [tipPercent, setTipPercent] = useState(20);
  const [people, setPeople] = useState(1);
  const [customTip, setCustomTip] = useState("");

  const tip = bill * (tipPercent / 100);
  const total = bill + tip;
  const perPerson = people > 0 ? total / people : total;
  const tipPerPerson = people > 0 ? tip / people : tip;

  const fmt = (n: number) => "$" + n.toFixed(2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Tip Calculator</h1>
        <p className="text-[var(--text-secondary)]">
          Calculate tip and split the bill. Quick tip presets and custom percentages. Free online tip calculator.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm mb-1">Bill Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">$</span>
              <input type="number" value={bill} onChange={(e) => setBill(Number(e.target.value))} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded pl-8 pr-3 py-2.5 text-white text-lg font-mono" min={0} step={0.01} />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Tip: {tipPercent}%</label>
            <div className="flex gap-2 mb-2">
              {[10, 15, 18, 20, 25, 30].map((t) => (
                <button key={t} onClick={() => setTipPercent(t)} className={`flex-1 py-2 rounded text-sm font-bold ${tipPercent === t ? "bg-purple-600 text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"}`}>{t}%</button>
              ))}
            </div>
            <input type="range" min={0} max={50} value={tipPercent} onChange={(e) => setTipPercent(Number(e.target.value))} className="w-full accent-purple-500" />
          </div>

          <div>
            <label className="block text-sm mb-1">Split Between: {people} {people === 1 ? "person" : "people"}</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setPeople(Math.max(1, people - 1))} className="w-10 h-10 rounded bg-[var(--bg-primary)] text-white text-lg font-bold">-</button>
              <input type="range" min={1} max={20} value={people} onChange={(e) => setPeople(Number(e.target.value))} className="flex-1 accent-purple-500" />
              <button onClick={() => setPeople(Math.min(20, people + 1))} className="w-10 h-10 rounded bg-[var(--bg-primary)] text-white text-lg font-bold">+</button>
            </div>
          </div>
        </div>

        <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Tip Amount</span>
            <span className="text-white font-mono text-lg">{fmt(tip)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total</span>
            <span className="text-white font-mono text-lg">{fmt(total)}</span>
          </div>
          {people > 1 && (
            <>
              <div className="border-t border-purple-500/20 my-2" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tip per person</span>
                <span className="text-white font-mono">{fmt(tipPerPerson)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-purple-400">Each person pays</span>
                <span className="text-purple-400 font-mono text-xl">{fmt(perPerson)}</span>
              </div>
            </>
          )}
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
          <h3 className="font-bold text-sm mb-2">Quick Reference</h3>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[10, 15, 18, 20, 25, 30].map((t) => (
              <div key={t} className="text-center py-2 bg-[var(--bg-primary)] rounded">
                <div className="text-gray-400">{t}%</div>
                <div className="text-white font-mono font-bold">{fmt(bill * t / 100)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
