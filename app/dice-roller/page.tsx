"use client";
import { useState } from "react";

export default function DiceRoller() {
  const [sides, setSides] = useState(6);
  const [count, setCount] = useState(2);
  const [results, setResults] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState<number[][]>([]);

  const roll = () => {
    setRolling(true);
    setTimeout(() => {
      const r = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
      setResults(r);
      setHistory((h) => [r, ...h].slice(0, 20));
      setRolling(false);
    }, 400);
  };

  const total = results.reduce((s, r) => s + r, 0);
  const diceEmoji: Record<number, string> = { 1: "⚀", 2: "⚁", 3: "⚂", 4: "⚃", 5: "⚄", 6: "⚅" };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Dice Roller</h1>
        <p className="text-[var(--text-secondary)]">Roll dice online. D4, D6, D8, D10, D12, D20, D100. Multiple dice. History and totals. Free virtual dice roller.</p>
      </div>
      <div className="max-w-sm mx-auto space-y-4 text-center">
        <div className="flex gap-3 justify-center flex-wrap">
          {results.map((r, i) => (
            <div key={i} className={`w-20 h-20 rounded-xl flex items-center justify-center text-3xl font-bold border-2 transition-all ${rolling ? "animate-bounce border-purple-500 bg-purple-600/20" : "border-[var(--border)] bg-[var(--bg-secondary)]"}`}>
              {rolling ? "?" : sides === 6 ? (diceEmoji[r] || r) : r}
            </div>
          ))}
        </div>
        {results.length > 0 && !rolling && (
          <p className="text-3xl font-bold text-purple-400">Total: {total}</p>
        )}
        <div className="flex gap-3 justify-center items-center">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Dice</label>
            <select value={count} onChange={(e) => setCount(Number(e.target.value))} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm">
              {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Sides</label>
            <select value={sides} onChange={(e) => setSides(Number(e.target.value))} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm">
              {[4, 6, 8, 10, 12, 20, 100].map((s) => <option key={s} value={s}>D{s}</option>)}
            </select>
          </div>
        </div>
        <button onClick={roll} disabled={rolling} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-10 py-4 rounded-full font-bold text-xl">Roll!</button>
        {history.length > 0 && (
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-left">
            <h3 className="text-xs font-bold text-gray-400 mb-1">History</h3>
            <div className="space-y-0.5 max-h-32 overflow-auto">
              {history.map((h, i) => (
                <div key={i} className="flex justify-between text-xs font-mono">
                  <span className="text-white">[{h.join(", ")}]</span>
                  <span className="text-purple-400">= {h.reduce((s, r) => s + r, 0)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
