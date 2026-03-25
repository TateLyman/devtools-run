"use client";
import { useState, useRef } from "react";

const defaultItems = ["Pizza", "Tacos", "Sushi", "Burger", "Pasta", "Salad"];
const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f43f5e", "#6366f1", "#a855f7", "#06b6d4"];

export default function SpinWheel() {
  const [items, setItems] = useState(defaultItems);
  const [input, setInput] = useState(defaultItems.join("\n"));
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const updateItems = (text: string) => {
    setInput(text);
    setItems(text.split("\n").filter(Boolean));
  };

  const spin = () => {
    if (items.length < 2 || spinning) return;
    setSpinning(true);
    setResult(null);
    const extraSpins = 5 + Math.random() * 5;
    const newRotation = rotation + 360 * extraSpins + Math.random() * 360;
    setRotation(newRotation);

    setTimeout(() => {
      const normalizedAngle = newRotation % 360;
      const sliceAngle = 360 / items.length;
      const index = Math.floor(((360 - normalizedAngle + sliceAngle / 2) % 360) / sliceAngle) % items.length;
      setResult(items[index]);
      setSpinning(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Spin the Wheel</h1>
        <p className="text-[var(--text-secondary)]">Random picker wheel. Add your options, spin to decide. Great for choices, games, giveaways. Free spinner wheel.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
        <div className="space-y-3">
          <textarea value={input} onChange={(e) => updateItems(e.target.value)} placeholder="One option per line..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-40 resize-none text-sm" />
          <p className="text-xs text-gray-400">{items.length} options</p>
          <div className="flex gap-2 flex-wrap">
            {[["What to eat?", "Pizza\nTacos\nSushi\nBurger\nPasta\nSalad"], ["Yes/No", "Yes\nNo"], ["Team picker", "Team A\nTeam B\nTeam C\nTeam D"], ["Numbers", "1\n2\n3\n4\n5\n6\n7\n8\n9\n10"]].map(([label, val]) => (
              <button key={label} onClick={() => updateItems(val)} className="px-2 py-1 rounded text-[10px] bg-[var(--bg-secondary)] text-gray-400 hover:text-white">{label}</button>
            ))}
          </div>
        </div>
        <div className="text-center space-y-4">
          <div className="relative w-64 h-64 mx-auto">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-white" />
            {/* Wheel */}
            <svg viewBox="0 0 200 200" className="w-full h-full" style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none" }}>
              {items.map((item, i) => {
                const angle = 360 / items.length;
                const startAngle = (i * angle - 90) * (Math.PI / 180);
                const endAngle = ((i + 1) * angle - 90) * (Math.PI / 180);
                const x1 = 100 + 95 * Math.cos(startAngle);
                const y1 = 100 + 95 * Math.sin(startAngle);
                const x2 = 100 + 95 * Math.cos(endAngle);
                const y2 = 100 + 95 * Math.sin(endAngle);
                const largeArc = angle > 180 ? 1 : 0;
                const midAngle = (startAngle + endAngle) / 2;
                const tx = 100 + 60 * Math.cos(midAngle);
                const ty = 100 + 60 * Math.sin(midAngle);
                return (
                  <g key={i}>
                    <path d={`M100,100 L${x1},${y1} A95,95 0 ${largeArc},1 ${x2},${y2} Z`} fill={colors[i % colors.length]} stroke="#1a1a2e" strokeWidth="1" />
                    <text x={tx} y={ty} fill="white" fontSize={items.length > 8 ? "6" : "8"} fontWeight="bold" textAnchor="middle" dominantBaseline="middle" transform={`rotate(${i * angle + angle / 2}, ${tx}, ${ty})`}>{item.slice(0, 12)}</text>
                  </g>
                );
              })}
            </svg>
          </div>
          {result && !spinning && (
            <div className="bg-purple-600/20 border border-purple-500/30 rounded-xl p-4">
              <p className="text-xs text-gray-400">Result:</p>
              <p className="text-2xl font-bold text-purple-400">{result}</p>
            </div>
          )}
          <button onClick={spin} disabled={spinning || items.length < 2} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-10 py-4 rounded-full font-bold text-xl">{spinning ? "Spinning..." : "SPIN!"}</button>
        </div>
      </div>
    </div>
  );
}
