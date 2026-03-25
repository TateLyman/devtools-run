"use client";
import { useState } from "react";

const firstNames = {
  male: ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Christopher", "Daniel", "Matthew", "Anthony", "Mark", "Alexander", "Benjamin", "Samuel", "Henry", "Sebastian", "Liam", "Noah", "Oliver", "Elijah", "Lucas"],
  female: ["Mary", "Patricia", "Jennifer", "Linda", "Barbara", "Elizabeth", "Susan", "Jessica", "Sarah", "Karen", "Emily", "Emma", "Olivia", "Ava", "Isabella", "Sophia", "Mia", "Charlotte", "Amelia", "Harper", "Evelyn", "Luna", "Aria", "Chloe", "Lily"],
  unisex: ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Quinn", "Avery", "Charlie", "Dakota", "Rowan", "Sage", "Skyler", "River", "Phoenix"],
  fantasy: ["Thorin", "Elara", "Zephyr", "Lyra", "Orion", "Seraphina", "Caspian", "Aurora", "Fenrir", "Celeste", "Draven", "Isolde", "Kaelen", "Nyx", "Theron", "Arwen", "Darius", "Freya", "Gideon", "Morgana"],
};

const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Wilson", "Anderson", "Taylor", "Thomas", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Clark", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Hill", "Green", "Adams", "Baker", "Hall", "Rivera", "Campbell", "Mitchell"];

const fantasyLastNames = ["Shadowmere", "Stormborn", "Nightwhisper", "Ironforge", "Starfall", "Bloodraven", "Moonfire", "Darkhollow", "Frostborn", "Silverwind", "Thornwood", "Dragonbane", "Wildfire", "Dawnbreaker", "Ravencrest"];

export default function NameGenerator() {
  const [type, setType] = useState<"male" | "female" | "unisex" | "fantasy">("male");
  const [count, setCount] = useState(10);
  const [names, setNames] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = () => {
    const pool = firstNames[type];
    const lNames = type === "fantasy" ? fantasyLastNames : lastNames;
    const generated = Array.from({ length: count }, () => {
      const first = pool[Math.floor(Math.random() * pool.length)];
      const last = lNames[Math.floor(Math.random() * lNames.length)];
      return `${first} ${last}`;
    });
    setNames(generated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Random Name Generator</h1>
        <p className="text-[var(--text-secondary)]">Generate random names. Male, female, unisex, or fantasy. Perfect for writing, games, testing, D&D characters. Free name generator.</p>
      </div>
      <div className="max-w-lg mx-auto space-y-4">
        <div className="flex gap-2 justify-center flex-wrap">
          {(["male", "female", "unisex", "fantasy"] as const).map((t) => (
            <button key={t} onClick={() => setType(t)} className={`px-4 py-2 rounded text-sm capitalize ${type === t ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400"}`}>{t}</button>
          ))}
        </div>
        <div className="flex gap-3 items-center justify-center">
          <label className="text-xs text-gray-400">Count:</label>
          <select value={count} onChange={(e) => setCount(Number(e.target.value))} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-1 text-white text-sm">
            {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <button onClick={generate} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-bold">Generate</button>
        </div>
        {names.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {names.map((name, i) => (
              <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-2.5 flex items-center justify-between cursor-pointer hover:border-purple-500/30" onClick={() => { navigator.clipboard.writeText(name); setCopied(i); setTimeout(() => setCopied(null), 1500); }}>
                <span className="text-white text-sm">{name}</span>
                <span className="text-xs text-purple-400">{copied === i ? "✓" : ""}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
