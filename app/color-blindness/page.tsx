"use client";
import { useState } from "react";

function simulateColorBlindness(hex: string, type: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  let nr = r, ng = g, nb = b;

  switch (type) {
    case "protanopia": // No red cones
      nr = 0.567 * r + 0.433 * g;
      ng = 0.558 * r + 0.442 * g;
      nb = 0.242 * g + 0.758 * b;
      break;
    case "deuteranopia": // No green cones
      nr = 0.625 * r + 0.375 * g;
      ng = 0.7 * r + 0.3 * g;
      nb = 0.3 * g + 0.7 * b;
      break;
    case "tritanopia": // No blue cones
      nr = 0.95 * r + 0.05 * g;
      ng = 0.433 * g + 0.567 * b;
      nb = 0.475 * g + 0.525 * b;
      break;
    case "achromatopsia": // Complete color blindness
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      nr = ng = nb = gray;
      break;
  }

  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v * 255)));
  return `#${clamp(nr).toString(16).padStart(2, "0")}${clamp(ng).toString(16).padStart(2, "0")}${clamp(nb).toString(16).padStart(2, "0")}`;
}

const types = [
  { id: "normal", label: "Normal Vision", desc: "How most people see" },
  { id: "protanopia", label: "Protanopia", desc: "Red-blind (~1% of males)" },
  { id: "deuteranopia", label: "Deuteranopia", desc: "Green-blind (~5% of males)" },
  { id: "tritanopia", label: "Tritanopia", desc: "Blue-blind (~0.003%)" },
  { id: "achromatopsia", label: "Achromatopsia", desc: "Total color blindness" },
];

export default function ColorBlindness() {
  const [colors, setColors] = useState(["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7", "#ec4899"]);

  const addColor = () => {
    const hex = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    setColors([...colors, hex]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Color Blindness Simulator</h1>
        <p className="text-[var(--text-secondary)]">
          See how your colors look to people with different types of color blindness. Test accessibility of your color palette.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        {colors.map((color, i) => (
          <div key={i} className="flex items-center gap-1">
            <input type="color" value={color} onChange={(e) => { const c = [...colors]; c[i] = e.target.value; setColors(c); }} className="w-8 h-8 rounded cursor-pointer" />
            <button onClick={() => setColors(colors.filter((_, idx) => idx !== i))} className="text-xs text-gray-500 hover:text-red-400">x</button>
          </div>
        ))}
        <button onClick={addColor} className="px-3 py-1 rounded text-xs bg-purple-600 hover:bg-purple-700 text-white">+ Add</button>
      </div>

      <div className="space-y-4">
        {types.map((type) => (
          <div key={type.id} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-bold text-sm text-white">{type.label}</span>
                <span className="text-xs text-gray-400 ml-2">{type.desc}</span>
              </div>
            </div>
            <div className="flex gap-2 h-16 rounded overflow-hidden">
              {colors.map((color, i) => {
                const simulated = type.id === "normal" ? color : simulateColorBlindness(color, type.id);
                return (
                  <div key={i} className="flex-1 flex items-end justify-center pb-1" style={{ backgroundColor: simulated }}>
                    <span className="text-[9px] font-mono text-white/80 bg-black/30 px-1 rounded">{simulated}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-xs text-[var(--text-secondary)]">
        <h3 className="font-bold text-white mb-1">About Color Blindness</h3>
        <p>~8% of men and ~0.5% of women have some form of color vision deficiency. Testing your designs ensures they are accessible to everyone. The most common type is deuteranopia (red-green color blindness).</p>
      </div>
    </div>
  );
}
