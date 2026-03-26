"use client";
import { useState } from "react";

const ACTIVITIES = [
  { name: "Sedentary", desc: "Little or no exercise", mult: 1.2 },
  { name: "Light", desc: "Light exercise 1-3 days/week", mult: 1.375 },
  { name: "Moderate", desc: "Moderate exercise 3-5 days/week", mult: 1.55 },
  { name: "Active", desc: "Hard exercise 6-7 days/week", mult: 1.725 },
  { name: "Very Active", desc: "Very hard exercise + physical job", mult: 1.9 },
];

export default function BMRCalc() {
  const [gender, setGender] = useState<"male"|"female">("male");
  const [age, setAge] = useState("25");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [activity, setActivity] = useState(2);
  const [unit, setUnit] = useState<"metric"|"imperial">("metric");

  const w = parseFloat(weight) || 0;
  const h = parseFloat(height) || 0;
  const a = parseInt(age) || 0;

  const wKg = unit === "imperial" ? w * 0.453592 : w;
  const hCm = unit === "imperial" ? h * 2.54 : h;

  const bmr = gender === "male"
    ? 10 * wKg + 6.25 * hCm - 5 * a + 5
    : 10 * wKg + 6.25 * hCm - 5 * a - 161;

  const tdee = bmr * ACTIVITIES[activity].mult;

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">BMR & TDEE Calculator</h1>
        <p className="text-[var(--text-secondary)]">Mifflin-St Jeor equation</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 space-y-4">
        <div className="flex gap-2 justify-center">
          {(["metric", "imperial"] as const).map(u => (
            <button key={u} onClick={() => setUnit(u)} className={`px-4 py-1 rounded text-sm capitalize ${unit === u ? "bg-blue-600 text-white" : "bg-[var(--bg-primary)] border border-[var(--border)]"}`}>{u}</button>
          ))}
        </div>
        <div className="flex gap-2 justify-center">
          {(["male", "female"] as const).map(g => (
            <button key={g} onClick={() => setGender(g)} className={`px-4 py-2 rounded-lg capitalize ${gender === g ? "bg-blue-600 text-white" : "bg-[var(--bg-primary)] border border-[var(--border)]"}`}>{g}</button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div><label className="text-sm text-[var(--text-secondary)]">Age</label><input value={age} onChange={e => setAge(e.target.value)} type="number" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono" /></div>
          <div><label className="text-sm text-[var(--text-secondary)]">Weight ({unit === "metric" ? "kg" : "lbs"})</label><input value={weight} onChange={e => setWeight(e.target.value)} type="number" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono" /></div>
          <div><label className="text-sm text-[var(--text-secondary)]">Height ({unit === "metric" ? "cm" : "inches"})</label><input value={height} onChange={e => setHeight(e.target.value)} type="number" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono" /></div>
        </div>
        <div>
          <label className="text-sm text-[var(--text-secondary)] block mb-2">Activity Level</label>
          <div className="space-y-1">
            {ACTIVITIES.map((act, i) => (
              <button key={i} onClick={() => setActivity(i)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${activity === i ? "bg-blue-600/20 border border-blue-500/50" : "bg-[var(--bg-primary)] border border-transparent hover:border-[var(--border)]"}`}>
                <strong>{act.name}</strong> <span className="text-[var(--text-secondary)]">— {act.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 text-center">
          <div className="text-xs text-[var(--text-secondary)]">BMR (Basal Metabolic Rate)</div>
          <div className="text-4xl font-bold text-blue-400">{Math.round(bmr)}</div>
          <div className="text-sm text-[var(--text-secondary)]">calories/day at rest</div>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 text-center">
          <div className="text-xs text-[var(--text-secondary)]">TDEE (Total Daily Energy)</div>
          <div className="text-4xl font-bold text-emerald-400">{Math.round(tdee)}</div>
          <div className="text-sm text-[var(--text-secondary)]">calories/day with activity</div>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-3">Goal Calories</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { name: "Lose Weight", cal: Math.round(tdee - 500), desc: "-500 cal/day = ~1 lb/week" },
            { name: "Maintain", cal: Math.round(tdee), desc: "Current weight" },
            { name: "Gain Weight", cal: Math.round(tdee + 500), desc: "+500 cal/day = ~1 lb/week" },
          ].map(g => (
            <div key={g.name} className="bg-[var(--bg-primary)] rounded-lg p-3 text-center">
              <div className="text-sm font-bold">{g.name}</div>
              <div className="text-xl font-bold text-blue-400">{g.cal}</div>
              <div className="text-xs text-[var(--text-secondary)]">{g.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
