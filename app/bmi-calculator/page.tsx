"use client";
import { useState } from "react";

export default function BMICalculator() {
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [weight, setWeight] = useState(170);
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(10);
  const [heightCm, setHeightCm] = useState(178);
  const [weightKg, setWeightKg] = useState(77);

  let bmi: number;
  if (unit === "imperial") {
    const totalInches = heightFt * 12 + heightIn;
    bmi = totalInches > 0 ? (weight / (totalInches * totalInches)) * 703 : 0;
  } else {
    const heightM = heightCm / 100;
    bmi = heightM > 0 ? weightKg / (heightM * heightM) : 0;
  }

  const category = bmi < 18.5 ? { label: "Underweight", color: "text-blue-400", bg: "bg-blue-500" }
    : bmi < 25 ? { label: "Normal", color: "text-emerald-400", bg: "bg-emerald-500" }
    : bmi < 30 ? { label: "Overweight", color: "text-yellow-400", bg: "bg-yellow-500" }
    : { label: "Obese", color: "text-red-400", bg: "bg-red-500" };

  const normalMin = unit === "imperial"
    ? Math.round(18.5 * Math.pow(heightFt * 12 + heightIn, 2) / 703)
    : Math.round(18.5 * Math.pow(heightCm / 100, 2));
  const normalMax = unit === "imperial"
    ? Math.round(24.9 * Math.pow(heightFt * 12 + heightIn, 2) / 703)
    : Math.round(24.9 * Math.pow(heightCm / 100, 2));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">BMI Calculator</h1>
        <p className="text-[var(--text-secondary)]">
          Calculate your Body Mass Index. Supports imperial and metric units. See your BMI category and healthy weight range.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <div className="flex gap-2 justify-center">
          <button onClick={() => setUnit("imperial")} className={`px-4 py-2 rounded text-sm ${unit === "imperial" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>Imperial (lb/ft)</button>
          <button onClick={() => setUnit("metric")} className={`px-4 py-2 rounded text-sm ${unit === "metric" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>Metric (kg/cm)</button>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6 space-y-4">
          {unit === "imperial" ? (
            <>
              <div>
                <label className="block text-sm mb-1">Weight: {weight} lbs</label>
                <input type="range" min={80} max={400} value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full accent-purple-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Height: {heightFt} ft</label>
                  <input type="range" min={3} max={7} value={heightFt} onChange={(e) => setHeightFt(Number(e.target.value))} className="w-full accent-purple-500" />
                </div>
                <div>
                  <label className="block text-sm mb-1">{heightIn} in</label>
                  <input type="range" min={0} max={11} value={heightIn} onChange={(e) => setHeightIn(Number(e.target.value))} className="w-full accent-purple-500" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm mb-1">Weight: {weightKg} kg</label>
                <input type="range" min={30} max={200} value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} className="w-full accent-purple-500" />
              </div>
              <div>
                <label className="block text-sm mb-1">Height: {heightCm} cm</label>
                <input type="range" min={120} max={220} value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} className="w-full accent-purple-500" />
              </div>
            </>
          )}
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6 text-center">
          <p className="text-xs text-gray-400 mb-1">Your BMI</p>
          <p className={`text-5xl font-bold ${category.color}`}>{bmi.toFixed(1)}</p>
          <p className={`text-lg font-bold mt-1 ${category.color}`}>{category.label}</p>
          <div className="mt-4 h-3 rounded-full bg-gray-800 overflow-hidden relative">
            <div className="absolute inset-0 flex">
              <div className="bg-blue-500 flex-1" />
              <div className="bg-emerald-500 flex-1" />
              <div className="bg-yellow-500 flex-1" />
              <div className="bg-red-500 flex-1" />
            </div>
            <div className="absolute top-0 bottom-0 w-1 bg-white rounded" style={{ left: `${Math.min(97, Math.max(3, ((bmi - 12) / 30) * 100))}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-sm">
          <p className="text-[var(--text-secondary)]">
            Healthy weight range for your height: <span className="text-emerald-400 font-bold">{normalMin}–{normalMax} {unit === "imperial" ? "lbs" : "kg"}</span>
          </p>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-xs text-[var(--text-secondary)]">
          <h3 className="font-bold text-white mb-1">BMI Categories</h3>
          <div className="grid grid-cols-2 gap-1">
            <span className="text-blue-400">Underweight: &lt; 18.5</span>
            <span className="text-emerald-400">Normal: 18.5–24.9</span>
            <span className="text-yellow-400">Overweight: 25–29.9</span>
            <span className="text-red-400">Obese: 30+</span>
          </div>
          <p className="mt-2 text-gray-500">BMI is a screening tool, not a diagnostic. Consult a healthcare provider for medical advice.</p>
        </div>
      </div>
    </div>
  );
}
