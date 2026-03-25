"use client";
import { useState } from "react";

export default function CalorieCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(170);
  const [height, setHeight] = useState(70);
  const [activity, setActivity] = useState(1.55);
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [goal, setGoal] = useState<"maintain" | "lose" | "gain">("maintain");

  const weightKg = unit === "imperial" ? weight * 0.453592 : weight;
  const heightCm = unit === "imperial" ? height * 2.54 : height;

  // Mifflin-St Jeor
  const bmr = gender === "male"
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const tdee = Math.round(bmr * activity);
  const goalCals = goal === "lose" ? tdee - 500 : goal === "gain" ? tdee + 500 : tdee;

  const protein = Math.round(weightKg * 2);
  const fat = Math.round((goalCals * 0.25) / 9);
  const carbs = Math.round((goalCals - protein * 4 - fat * 9) / 4);

  const activities = [
    { val: 1.2, label: "Sedentary (desk job)" },
    { val: 1.375, label: "Light exercise (1-3 days/week)" },
    { val: 1.55, label: "Moderate (3-5 days/week)" },
    { val: 1.725, label: "Active (6-7 days/week)" },
    { val: 1.9, label: "Very active (athlete)" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Calorie Calculator</h1>
        <p className="text-[var(--text-secondary)]">Calculate daily calories needed. BMR, TDEE, macros (protein, carbs, fat). Based on Mifflin-St Jeor equation.</p>
      </div>
      <div className="max-w-lg mx-auto space-y-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
          <div className="flex gap-2">
            <button onClick={() => setGender("male")} className={`flex-1 py-2 rounded ${gender === "male" ? "bg-blue-600 text-white" : "bg-[var(--bg-primary)] text-gray-400"}`}>Male</button>
            <button onClick={() => setGender("female")} className={`flex-1 py-2 rounded ${gender === "female" ? "bg-pink-600 text-white" : "bg-[var(--bg-primary)] text-gray-400"}`}>Female</button>
            <button onClick={() => setUnit(unit === "imperial" ? "metric" : "imperial")} className="px-3 py-2 rounded bg-[var(--bg-primary)] text-gray-400 text-xs">{unit === "imperial" ? "lb/in" : "kg/cm"}</button>
          </div>
          <div><div className="flex justify-between text-sm mb-1"><label>Age</label><span className="text-white">{age}</span></div><input type="range" min={15} max={80} value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full accent-purple-500" /></div>
          <div><div className="flex justify-between text-sm mb-1"><label>Weight</label><span className="text-white">{weight} {unit === "imperial" ? "lbs" : "kg"}</span></div><input type="range" min={unit === "imperial" ? 80 : 36} max={unit === "imperial" ? 400 : 180} value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full accent-purple-500" /></div>
          <div><div className="flex justify-between text-sm mb-1"><label>Height</label><span className="text-white">{height} {unit === "imperial" ? "in" : "cm"}</span></div><input type="range" min={unit === "imperial" ? 48 : 120} max={unit === "imperial" ? 84 : 220} value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full accent-purple-500" /></div>
          <div>
            <label className="block text-sm mb-1">Activity Level</label>
            <select value={activity} onChange={(e) => setActivity(Number(e.target.value))} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm">
              {activities.map((a) => <option key={a.val} value={a.val}>{a.label}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            {(["lose", "maintain", "gain"] as const).map((g) => (
              <button key={g} onClick={() => setGoal(g)} className={`flex-1 py-2 rounded text-sm capitalize ${goal === g ? "bg-purple-600 text-white" : "bg-[var(--bg-primary)] text-gray-400"}`}>{g === "lose" ? "Lose Weight" : g === "gain" ? "Gain Muscle" : "Maintain"}</button>
            ))}
          </div>
        </div>
        <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 text-center">
          <p className="text-xs text-gray-400">Daily Calories</p>
          <p className="text-5xl font-bold text-purple-400">{goalCals.toLocaleString()}</p>
          <p className="text-sm text-gray-400">kcal/day {goal === "lose" ? "(deficit -500)" : goal === "gain" ? "(surplus +500)" : ""}</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-2 text-center"><p className="text-xs text-gray-400">BMR</p><p className="text-sm font-bold text-white">{Math.round(bmr)}</p></div>
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-2 text-center"><p className="text-xs text-blue-400">Protein</p><p className="text-sm font-bold text-white">{protein}g</p></div>
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-center"><p className="text-xs text-yellow-400">Carbs</p><p className="text-sm font-bold text-white">{carbs}g</p></div>
          <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-2 text-center"><p className="text-xs text-red-400">Fat</p><p className="text-sm font-bold text-white">{fat}g</p></div>
        </div>
      </div>
    </div>
  );
}
