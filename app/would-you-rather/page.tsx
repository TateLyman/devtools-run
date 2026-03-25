"use client";
import { useState } from "react";

const questions = [
  ["Have the ability to fly", "Have the ability to read minds"],
  ["Never use social media again", "Never watch another movie or TV show"],
  ["Be famous but always broke", "Be unknown but wealthy"],
  ["Have unlimited storage on your phone", "Have unlimited battery life"],
  ["Always have to tell the truth", "Always have to lie"],
  ["Live in the future", "Live in the past"],
  ["Be able to speak every language", "Be able to play every instrument"],
  ["Have free WiFi everywhere", "Have free coffee everywhere"],
  ["Be a master coder", "Be a master designer"],
  ["Work from anywhere", "Work 4 days a week in an office"],
  ["Have a rewind button for life", "Have a pause button for life"],
  ["Know when you're going to die", "Know how you're going to die"],
  ["Give up your phone", "Give up your computer"],
  ["Be stuck in a room with no windows", "Be stuck outside with no shelter"],
  ["Always be 10 minutes late", "Always be 20 minutes early"],
  ["Have super speed", "Have super strength"],
  ["Live without music", "Live without TV"],
  ["Be the funniest person in the room", "Be the smartest person in the room"],
  ["Have a personal chef", "Have a personal trainer"],
  ["Never have to sleep", "Never have to eat"],
];

export default function WouldYouRather() {
  const [index, setIndex] = useState(0);
  const [votes, setVotes] = useState<Record<number, { a: number; b: number }>>({});
  const [picked, setPicked] = useState<"a" | "b" | null>(null);

  const q = questions[index % questions.length];
  const v = votes[index] || { a: Math.floor(Math.random() * 500) + 100, b: Math.floor(Math.random() * 500) + 100 };

  const pick = (choice: "a" | "b") => {
    setPicked(choice);
    const updated = { ...v, [choice]: v[choice] + 1 };
    setVotes({ ...votes, [index]: updated });
  };

  const next = () => {
    setIndex((i) => (i + 1) % questions.length);
    setPicked(null);
  };

  const totalVotes = v.a + v.b;
  const pctA = Math.round((v.a / totalVotes) * 100);
  const pctB = 100 - pctA;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Would You Rather?</h1>
        <p className="text-[var(--text-secondary)]">The classic game. Pick one, see how others voted. 20 questions. Fun icebreaker for friends, teams, classrooms.</p>
      </div>
      <div className="max-w-md mx-auto space-y-4 text-center">
        <p className="text-xs text-gray-400">Question {index + 1} of {questions.length}</p>
        <div className="space-y-3">
          <button onClick={() => pick("a")} disabled={!!picked} className={`w-full p-6 rounded-xl text-left text-lg font-bold transition-all ${picked === "a" ? "bg-purple-600 text-white scale-105" : picked === "b" ? "bg-[var(--bg-secondary)] text-gray-500 scale-95" : "bg-[var(--bg-secondary)] border border-[var(--border)] text-white hover:border-purple-500/50 hover:scale-[1.02]"}`}>
            {q[0]}
            {picked && <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-purple-500 transition-all" style={{ width: `${pctA}%` }} /></div>}
            {picked && <p className="text-xs mt-1 text-gray-400">{pctA}% ({v.a} votes)</p>}
          </button>
          <p className="text-gray-500 font-bold">OR</p>
          <button onClick={() => pick("b")} disabled={!!picked} className={`w-full p-6 rounded-xl text-left text-lg font-bold transition-all ${picked === "b" ? "bg-emerald-600 text-white scale-105" : picked === "a" ? "bg-[var(--bg-secondary)] text-gray-500 scale-95" : "bg-[var(--bg-secondary)] border border-[var(--border)] text-white hover:border-emerald-500/50 hover:scale-[1.02]"}`}>
            {q[1]}
            {picked && <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 transition-all" style={{ width: `${pctB}%` }} /></div>}
            {picked && <p className="text-xs mt-1 text-gray-400">{pctB}% ({v.b} votes)</p>}
          </button>
        </div>
        {picked && <button onClick={next} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold text-lg">Next Question →</button>}
      </div>
    </div>
  );
}
