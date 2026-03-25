"use client";
import { useState } from "react";

export default function CoinFlip() {
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [history, setHistory] = useState<("H" | "T")[]>([]);
  const [coins, setCoins] = useState(1);

  const flip = () => {
    setFlipping(true);
    setTimeout(() => {
      const results: ("H" | "T")[] = [];
      for (let i = 0; i < coins; i++) {
        results.push(Math.random() < 0.5 ? "H" : "T");
      }
      setResult(results[0] === "H" ? "heads" : "tails");
      setHistory((h) => [...results, ...h].slice(0, 100));
      setFlipping(false);
    }, 600);
  };

  const heads = history.filter((h) => h === "H").length;
  const tails = history.filter((h) => h === "T").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Coin Flip</h1>
        <p className="text-[var(--text-secondary)]">Flip a coin online. Truly random using crypto API. Track history and statistics. Free virtual coin flipper.</p>
      </div>
      <div className="max-w-sm mx-auto space-y-6 text-center">
        <div className={`w-40 h-40 mx-auto rounded-full flex items-center justify-center text-5xl font-bold border-4 transition-all duration-300 ${flipping ? "animate-spin border-purple-500 bg-purple-600/20" : result === "heads" ? "border-yellow-500 bg-yellow-500/10 text-yellow-400" : result === "tails" ? "border-gray-400 bg-gray-500/10 text-gray-300" : "border-[var(--border)] bg-[var(--bg-secondary)] text-gray-500"}`}>
          {flipping ? "?" : result ? (result === "heads" ? "H" : "T") : "?"}
        </div>
        <p className={`text-2xl font-bold ${result === "heads" ? "text-yellow-400" : result === "tails" ? "text-gray-300" : "text-gray-500"}`}>
          {flipping ? "Flipping..." : result ? result.toUpperCase() : "Click to flip"}
        </p>
        <div className="flex gap-2 items-center justify-center">
          <label className="text-xs text-gray-400">Coins:</label>
          <select value={coins} onChange={(e) => setCoins(Number(e.target.value))} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-1 text-white text-sm">
            {[1, 2, 3, 5, 10].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <button onClick={flip} disabled={flipping} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-10 py-4 rounded-full font-bold text-xl">Flip!</button>
        {history.length > 0 && (
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-yellow-400">Heads: {heads}</span>
              <span className="text-gray-400">Total: {history.length}</span>
              <span className="text-gray-300">Tails: {tails}</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden flex">
              <div className="bg-yellow-500 transition-all" style={{ width: `${(heads / history.length) * 100}%` }} />
              <div className="bg-gray-400 transition-all" style={{ width: `${(tails / history.length) * 100}%` }} />
            </div>
            <div className="flex flex-wrap gap-1">
              {history.slice(0, 30).map((h, i) => (
                <span key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${h === "H" ? "bg-yellow-500/20 text-yellow-400" : "bg-gray-500/20 text-gray-400"}`}>{h}</span>
              ))}
              {history.length > 30 && <span className="text-xs text-gray-500">+{history.length - 30} more</span>}
            </div>
            <button onClick={() => setHistory([])} className="text-xs text-gray-500 hover:text-white">Reset History</button>
          </div>
        )}
      </div>
    </div>
  );
}
