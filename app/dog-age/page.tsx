"use client";
import { useState } from "react";

const sizes: Record<string, { label: string; multipliers: number[] }> = {
  small: { label: "Small (under 20 lbs)", multipliers: [15, 9, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3] },
  medium: { label: "Medium (20-50 lbs)", multipliers: [15, 9, 5, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
  large: { label: "Large (50-100 lbs)", multipliers: [15, 9, 5, 4, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7] },
  giant: { label: "Giant (100+ lbs)", multipliers: [12, 9, 8, 7, 6, 6, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10] },
};

function dogToHuman(dogYears: number, size: string): number {
  const mults = sizes[size].multipliers;
  let human = 0;
  for (let i = 0; i < Math.min(Math.floor(dogYears), mults.length); i++) human += mults[i];
  const fraction = dogYears - Math.floor(dogYears);
  const nextMult = mults[Math.min(Math.floor(dogYears), mults.length - 1)];
  human += fraction * nextMult;
  return Math.round(human);
}

export default function DogAge() {
  const [dogYears, setDogYears] = useState(5);
  const [size, setSize] = useState("medium");

  const humanAge = dogToHuman(dogYears, size);
  const lifeStage = humanAge < 15 ? "Puppy 🐶" : humanAge < 30 ? "Young Adult 🐕" : humanAge < 55 ? "Adult 🐕‍🦺" : humanAge < 75 ? "Senior 🦮" : "Geriatric 👴";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Dog Age Calculator</h1>
        <p className="text-[var(--text-secondary)]">Convert dog years to human years accurately. Based on size — small, medium, large, giant breeds have different aging rates.</p>
      </div>
      <div className="max-w-sm mx-auto space-y-4 text-center">
        <div className="flex gap-2 justify-center flex-wrap">
          {Object.entries(sizes).map(([k, v]) => (
            <button key={k} onClick={() => setSize(k)} className={`px-3 py-1.5 rounded text-xs ${size === k ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400"}`}>{v.label}</button>
          ))}
        </div>
        <div>
          <label className="block text-sm mb-1">Dog's Age: {dogYears} years</label>
          <input type="range" min={0.5} max={20} step={0.5} value={dogYears} onChange={(e) => setDogYears(Number(e.target.value))} className="w-full accent-purple-500" />
        </div>
        <div className="bg-gradient-to-br from-orange-900/30 to-yellow-900/30 border border-orange-500/20 rounded-2xl p-8">
          <p className="text-6xl mb-2">🐕</p>
          <p className="text-sm text-gray-400">{dogYears} dog years =</p>
          <p className="text-5xl font-bold text-orange-400">{humanAge}</p>
          <p className="text-lg text-white">human years</p>
          <p className="text-sm text-orange-300 mt-2">{lifeStage}</p>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-xs text-[var(--text-secondary)]">
          <p>Smaller dogs tend to live longer than larger dogs. A 7-year-old Great Dane is much older in "human years" than a 7-year-old Chihuahua.</p>
        </div>
      </div>
    </div>
  );
}
