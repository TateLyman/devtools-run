"use client";
import { useState } from "react";

interface Ingredient { name: string; amount: number; unit: string }

export default function RecipeScaler() {
  const [originalServings, setOriginalServings] = useState(4);
  const [targetServings, setTargetServings] = useState(8);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "flour", amount: 2, unit: "cups" },
    { name: "sugar", amount: 1, unit: "cup" },
    { name: "butter", amount: 0.5, unit: "cup" },
    { name: "eggs", amount: 3, unit: "" },
    { name: "milk", amount: 1.5, unit: "cups" },
    { name: "vanilla extract", amount: 1, unit: "tsp" },
    { name: "baking powder", amount: 2, unit: "tsp" },
    { name: "salt", amount: 0.5, unit: "tsp" },
  ]);
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newUnit, setNewUnit] = useState("");

  const ratio = originalServings > 0 ? targetServings / originalServings : 1;

  const addIngredient = () => {
    if (newName && newAmount) {
      setIngredients([...ingredients, { name: newName, amount: parseFloat(newAmount), unit: newUnit }]);
      setNewName(""); setNewAmount(""); setNewUnit("");
    }
  };

  const formatAmount = (n: number) => {
    if (n === Math.floor(n)) return n.toString();
    const fractions: Record<string, string> = { "0.25": "¼", "0.33": "⅓", "0.5": "½", "0.67": "⅔", "0.75": "¾" };
    const whole = Math.floor(n);
    const frac = (n - whole).toFixed(2);
    const fracStr = fractions[frac] || (n - whole).toFixed(1);
    return whole > 0 ? `${whole} ${fracStr}` : fracStr;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Recipe Scaler</h1>
        <p className="text-[var(--text-secondary)]">Scale recipe ingredients up or down. Enter original servings and target servings. Free recipe multiplier.</p>
      </div>
      <div className="max-w-lg mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-center">
            <label className="block text-xs text-gray-400 mb-1">Original Servings</label>
            <input type="number" value={originalServings} onChange={(e) => setOriginalServings(Number(e.target.value))} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-xl font-bold text-center" min={1} />
          </div>
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-3 text-center">
            <label className="block text-xs text-purple-400 mb-1">Target Servings</label>
            <input type="number" value={targetServings} onChange={(e) => setTargetServings(Number(e.target.value))} className="w-full bg-[var(--bg-primary)] border border-purple-500/30 rounded px-3 py-2 text-white text-xl font-bold text-center" min={1} />
          </div>
        </div>
        <p className="text-center text-sm text-gray-400">Multiplier: <span className="text-purple-400 font-bold">{ratio.toFixed(2)}x</span></p>
        <div className="space-y-1">
          {ingredients.map((ing, i) => (
            <div key={i} className="flex items-center gap-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-2">
              <span className="text-gray-500 font-mono text-xs w-16 text-right line-through">{formatAmount(ing.amount)} {ing.unit}</span>
              <span className="text-white">→</span>
              <span className="text-emerald-400 font-bold font-mono w-16">{formatAmount(ing.amount * ratio)} {ing.unit}</span>
              <span className="text-white text-sm flex-1">{ing.name}</span>
              <button onClick={() => setIngredients(ingredients.filter((_, idx) => idx !== i))} className="text-xs text-gray-600 hover:text-red-400">✕</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ingredient" className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm" />
          <input value={newAmount} onChange={(e) => setNewAmount(e.target.value)} placeholder="Amt" type="number" className="w-16 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm" />
          <input value={newUnit} onChange={(e) => setNewUnit(e.target.value)} placeholder="Unit" className="w-16 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm" />
          <button onClick={addIngredient} className="bg-purple-600 text-white px-3 rounded text-sm font-bold">+</button>
        </div>
      </div>
    </div>
  );
}
