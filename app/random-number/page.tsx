"use client";
import { useState } from "react";

export default function RandomNumber() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [unique, setUnique] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [animating, setAnimating] = useState(false);

  const generate = () => {
    setAnimating(true);
    const nums: number[] = [];
    if (unique && count <= max - min + 1) {
      const pool = Array.from({ length: max - min + 1 }, (_, i) => min + i);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      nums.push(...pool.slice(0, count));
    } else {
      for (let i = 0; i < count; i++) {
        nums.push(Math.floor(Math.random() * (max - min + 1)) + min);
      }
    }
    setResults(nums);
    setTimeout(() => setAnimating(false), 300);
  };

  const coinFlip = () => {
    setResults([Math.random() < 0.5 ? 0 : 1]);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
  };

  const diceRoll = (sides: number) => {
    setResults([Math.floor(Math.random() * sides) + 1]);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Random Number Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate random numbers, flip coins, roll dice. Customizable range, bulk generation, unique numbers. Free online RNG.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6 text-center">
          <div className={`text-6xl font-bold font-mono text-purple-400 transition-transform ${animating ? "scale-110" : ""}`}>
            {results.length === 0 ? "?" : results.length === 1 && results[0] <= 1 && min === 0 && max === 1 ? (results[0] === 1 ? "Heads" : "Tails") : results.length === 1 ? results[0] : ""}
          </div>
          {results.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              {results.map((n, i) => (
                <span key={i} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-1 font-mono text-white">{n}</span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Min</label>
              <input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-center font-mono" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Max</label>
              <input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-center font-mono" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Count</label>
              <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-center font-mono" />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} className="accent-purple-500" />
            No duplicates
          </label>

          <button onClick={generate} className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded font-bold text-lg">
            Generate
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button onClick={coinFlip} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-center hover:border-purple-500/50">
            <div className="text-2xl mb-1">🪙</div>
            <div className="text-xs text-gray-400">Coin Flip</div>
          </button>
          <button onClick={() => diceRoll(6)} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-center hover:border-purple-500/50">
            <div className="text-2xl mb-1">🎲</div>
            <div className="text-xs text-gray-400">Roll D6</div>
          </button>
          <button onClick={() => diceRoll(20)} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-center hover:border-purple-500/50">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-xs text-gray-400">Roll D20</div>
          </button>
        </div>

        {results.length > 1 && (
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>Sum: {results.reduce((a, b) => a + b, 0)}</span>
              <span>Avg: {(results.reduce((a, b) => a + b, 0) / results.length).toFixed(2)}</span>
              <span>Min: {Math.min(...results)}</span>
              <span>Max: {Math.max(...results)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
