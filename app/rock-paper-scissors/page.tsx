"use client";
import { useState } from "react";

const choices = ["rock", "paper", "scissors"] as const;
const emojis: Record<string, string> = { rock: "🪨", paper: "📄", scissors: "✂️" };
const beats: Record<string, string> = { rock: "scissors", paper: "rock", scissors: "paper" };

export default function RPS() {
  const [player, setPlayer] = useState<string | null>(null);
  const [computer, setComputer] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [scores, setScores] = useState({ wins: 0, losses: 0, draws: 0 });
  const [animating, setAnimating] = useState(false);

  const play = (choice: string) => {
    setAnimating(true);
    setPlayer(choice);
    setComputer(null);
    setResult(null);
    setTimeout(() => {
      const comp = choices[Math.floor(Math.random() * 3)];
      setComputer(comp);
      if (choice === comp) { setResult("draw"); setScores((s) => ({ ...s, draws: s.draws + 1 })); }
      else if (beats[choice] === comp) { setResult("win"); setScores((s) => ({ ...s, wins: s.wins + 1 })); }
      else { setResult("lose"); setScores((s) => ({ ...s, losses: s.losses + 1 })); }
      setAnimating(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Rock Paper Scissors</h1>
        <p className="text-[var(--text-secondary)]">Play Rock Paper Scissors against the computer. Track wins, losses, draws. Free online game.</p>
      </div>
      <div className="max-w-sm mx-auto space-y-6 text-center">
        <div className="flex justify-between text-sm">
          <span className="text-emerald-400">Wins: {scores.wins}</span>
          <span className="text-gray-400">Draws: {scores.draws}</span>
          <span className="text-red-400">Losses: {scores.losses}</span>
        </div>
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <div className={`text-6xl transition-all ${animating ? "animate-bounce" : ""}`}>{player ? emojis[player] : "❓"}</div>
            <p className="text-xs text-gray-400 mt-1">You</p>
          </div>
          <div className="text-2xl font-bold text-gray-500 self-center">VS</div>
          <div className="text-center">
            <div className={`text-6xl transition-all ${animating ? "animate-spin" : ""}`}>{computer ? emojis[computer] : "❓"}</div>
            <p className="text-xs text-gray-400 mt-1">Computer</p>
          </div>
        </div>
        {result && !animating && (
          <p className={`text-2xl font-bold ${result === "win" ? "text-emerald-400" : result === "lose" ? "text-red-400" : "text-yellow-400"}`}>
            {result === "win" ? "You Win! 🎉" : result === "lose" ? "You Lose! 😢" : "It's a Draw! 🤝"}
          </p>
        )}
        <div className="flex gap-4 justify-center">
          {choices.map((c) => (
            <button key={c} onClick={() => play(c)} disabled={animating} className="w-24 h-24 bg-[var(--bg-secondary)] border-2 border-[var(--border)] rounded-xl text-4xl hover:border-purple-500 hover:scale-110 transition-all disabled:opacity-50">{emojis[c]}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
