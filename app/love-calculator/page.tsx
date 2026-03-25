"use client";
import { useState } from "react";

function calcLove(name1: string, name2: string): number {
  const combined = (name1 + name2).toLowerCase().replace(/[^a-z]/g, "");
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) - hash) + combined.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 101);
}

export default function LoveCalculator() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  const calculate = () => {
    if (!name1.trim() || !name2.trim()) return;
    setAnimating(true);
    setResult(null);
    setTimeout(() => { setResult(calcLove(name1, name2)); setAnimating(false); }, 1500);
  };

  const getMessage = (score: number) => {
    if (score >= 90) return "Perfect match! 💕";
    if (score >= 70) return "Great compatibility! 💖";
    if (score >= 50) return "There's potential! 💗";
    if (score >= 30) return "It could work... 💛";
    return "Maybe just friends? 😅";
  };

  const getColor = (score: number) => score >= 70 ? "text-pink-400" : score >= 40 ? "text-yellow-400" : "text-gray-400";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Love Calculator</h1>
        <p className="text-[var(--text-secondary)]">Calculate love compatibility between two names. Just for fun! Free love calculator.</p>
      </div>
      <div className="max-w-sm mx-auto space-y-4 text-center">
        <input value={name1} onChange={(e) => setName1(e.target.value)} placeholder="Your name" className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-white text-center text-lg" />
        <div className="text-3xl">❤️</div>
        <input value={name2} onChange={(e) => setName2(e.target.value)} placeholder="Their name" className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-white text-center text-lg" onKeyDown={(e) => e.key === "Enter" && calculate()} />
        <button onClick={calculate} disabled={animating || !name1.trim() || !name2.trim()} className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 disabled:opacity-50 text-white px-6 py-4 rounded-xl font-bold text-xl">{animating ? "Calculating... 💕" : "Calculate Love"}</button>
        {result !== null && !animating && (
          <div className="bg-pink-500/10 border-2 border-pink-500/30 rounded-xl p-8">
            <p className={`text-6xl font-bold ${getColor(result)}`}>{result}%</p>
            <p className="text-lg mt-2 text-white">{name1} & {name2}</p>
            <p className={`text-sm mt-1 ${getColor(result)}`}>{getMessage(result)}</p>
            <div className="mt-4 h-4 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-500 to-red-500 transition-all duration-1000" style={{ width: `${result}%` }} />
            </div>
          </div>
        )}
        <p className="text-[10px] text-gray-600">This is just for fun — results are based on name hashing, not real compatibility.</p>
      </div>
    </div>
  );
}
