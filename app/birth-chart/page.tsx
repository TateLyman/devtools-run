"use client";
import { useState } from "react";

const signs = [
  { name: "Aries", symbol: "♈", dates: "Mar 21 - Apr 19", element: "Fire", ruling: "Mars", traits: "Bold, ambitious, competitive, energetic" },
  { name: "Taurus", symbol: "♉", dates: "Apr 20 - May 20", element: "Earth", ruling: "Venus", traits: "Reliable, patient, practical, devoted" },
  { name: "Gemini", symbol: "♊", dates: "May 21 - Jun 20", element: "Air", ruling: "Mercury", traits: "Curious, adaptable, witty, social" },
  { name: "Cancer", symbol: "♋", dates: "Jun 21 - Jul 22", element: "Water", ruling: "Moon", traits: "Intuitive, emotional, nurturing, protective" },
  { name: "Leo", symbol: "♌", dates: "Jul 23 - Aug 22", element: "Fire", ruling: "Sun", traits: "Creative, passionate, generous, dramatic" },
  { name: "Virgo", symbol: "♍", dates: "Aug 23 - Sep 22", element: "Earth", ruling: "Mercury", traits: "Analytical, practical, diligent, modest" },
  { name: "Libra", symbol: "♎", dates: "Sep 23 - Oct 22", element: "Air", ruling: "Venus", traits: "Diplomatic, fair, social, idealistic" },
  { name: "Scorpio", symbol: "♏", dates: "Oct 23 - Nov 21", element: "Water", ruling: "Pluto", traits: "Passionate, resourceful, brave, intense" },
  { name: "Sagittarius", symbol: "♐", dates: "Nov 22 - Dec 21", element: "Fire", ruling: "Jupiter", traits: "Optimistic, adventurous, honest, philosophical" },
  { name: "Capricorn", symbol: "♑", dates: "Dec 22 - Jan 19", element: "Earth", ruling: "Saturn", traits: "Disciplined, responsible, ambitious, patient" },
  { name: "Aquarius", symbol: "♒", dates: "Jan 20 - Feb 18", element: "Air", ruling: "Uranus", traits: "Progressive, original, independent, humanitarian" },
  { name: "Pisces", symbol: "♓", dates: "Feb 19 - Mar 20", element: "Water", ruling: "Neptune", traits: "Compassionate, artistic, intuitive, wise" },
];

function getSign(month: number, day: number) {
  const ranges = [[3,21],[4,20],[5,21],[6,21],[7,23],[8,23],[9,23],[10,23],[11,22],[12,22],[1,20],[2,19]];
  for (let i = 0; i < 12; i++) {
    const [m, d] = ranges[i];
    const [nm, nd] = ranges[(i + 1) % 12];
    if ((month === m && day >= d) || (month === nm && day < nd)) return signs[i];
  }
  return signs[9]; // Capricorn default
}

export default function BirthChart() {
  const [month, setMonth] = useState(6);
  const [day, setDay] = useState(15);
  const sign = getSign(month, day);
  const elementColors: Record<string, string> = { Fire: "text-red-400", Earth: "text-green-400", Air: "text-sky-400", Water: "text-blue-400" };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Zodiac Sign Calculator</h1>
        <p className="text-[var(--text-secondary)]">Find your zodiac sign. Enter your birthday, see your sign, element, ruling planet, and personality traits.</p>
      </div>
      <div className="max-w-md mx-auto space-y-4 text-center">
        <div className="flex gap-3 justify-center">
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white">
            {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select value={day} onChange={(e) => setDay(Number(e.target.value))} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white">
            {Array.from({ length: 31 }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
          </select>
        </div>
        <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-2xl p-8">
          <p className="text-7xl mb-2">{sign.symbol}</p>
          <h2 className="text-3xl font-bold text-white">{sign.name}</h2>
          <p className="text-sm text-gray-400 mt-1">{sign.dates}</p>
          <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
            <div className="bg-[var(--bg-primary)] rounded-lg p-2">
              <p className="text-xs text-gray-400">Element</p>
              <p className={`font-bold ${elementColors[sign.element]}`}>{sign.element}</p>
            </div>
            <div className="bg-[var(--bg-primary)] rounded-lg p-2">
              <p className="text-xs text-gray-400">Ruling Planet</p>
              <p className="font-bold text-purple-400">{sign.ruling}</p>
            </div>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-4">{sign.traits}</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {signs.map((s) => (
            <button key={s.name} onClick={() => {
              const [m] = s.dates.split(" - ")[0].split(" ");
              const months: Record<string, number> = { Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12, Jan: 1, Feb: 2 };
              setMonth(months[m] || 1);
              setDay(parseInt(s.dates.split(" - ")[0].split(" ")[1]) || 1);
            }} className={`p-2 rounded text-center ${sign.name === s.name ? "bg-purple-600/20 border border-purple-500" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>
              <span className="text-lg">{s.symbol}</span>
              <p className="text-[9px] text-gray-400">{s.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
