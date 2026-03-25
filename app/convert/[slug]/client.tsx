"use client";
import { useState } from "react";
import Link from "next/link";

function pretty(s: string): string {
  return s.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
}

function doConvert(from: string, to: string, input: string, categories: any): string {
  const val = parseFloat(input);
  if (isNaN(val)) return "Enter a number";

  // Find category
  for (const [, cat] of Object.entries(categories) as any) {
    if (from in cat.units && to in cat.units) {
      if (cat.special) {
        // Temperature
        if (from === "celsius" && to === "fahrenheit") return (val * 9/5 + 32).toFixed(4);
        if (from === "fahrenheit" && to === "celsius") return ((val - 32) * 5/9).toFixed(4);
        if (from === "celsius" && to === "kelvin") return (val + 273.15).toFixed(4);
        if (from === "kelvin" && to === "celsius") return (val - 273.15).toFixed(4);
        if (from === "fahrenheit" && to === "kelvin") return (((val - 32) * 5/9) + 273.15).toFixed(4);
        if (from === "kelvin" && to === "fahrenheit") return ((val - 273.15) * 9/5 + 32).toFixed(4);
        // CSS
        if (from === "px" && to === "rem") return (val / 16).toFixed(6);
        if (from === "rem" && to === "px") return (val * 16).toFixed(2);
        if (from === "px" && to === "em") return (val / 16).toFixed(6);
        if (from === "em" && to === "px") return (val * 16).toFixed(2);
        if (from === "px" && to === "pt") return (val * 0.75).toFixed(2);
        if (from === "pt" && to === "px") return (val / 0.75).toFixed(2);
        return val.toFixed(6) + " (custom conversion)";
      }
      // Standard factor-based conversion
      const fromFactor = cat.units[from];
      const toFactor = cat.units[to];
      const baseValue = val * fromFactor;
      const result = baseValue / toFactor;
      return result < 0.000001 ? result.toExponential(6) : result < 1 ? result.toFixed(8) : result < 1000 ? result.toFixed(6) : result.toFixed(2);
    }
  }
  return "Conversion not supported";
}

export default function ConvertClient({ from, to, category, slug, allSlugs, categories }: {
  from: string; to: string; category: string; slug: string; allSlugs: string[]; categories: any;
}) {
  const [input, setInput] = useState("1");
  const output = doConvert(from, to, input, categories);
  const sameCat = allSlugs.filter(s => {
    const parts = s.split("-to-");
    return parts[0] in (categories[category]?.units || {});
  }).slice(0, 20);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-extrabold mb-2 text-center">{pretty(from)} to {pretty(to)}</h1>
        <p className="text-gray-400 text-center mb-8">Free online {pretty(from)} to {pretty(to)} converter.</p>
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">{pretty(from)}</label>
              <input type="number" value={input} onChange={e => setInput(e.target.value)} step="any"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-xl font-bold" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">{pretty(to)}</label>
              <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-xl font-bold text-green-400">{output}</div>
            </div>
          </div>
          <div className="text-center text-sm text-gray-400">
            {input} {pretty(from)} = {output} {pretty(to)}
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 mb-6">
          <div className="text-xs text-gray-400 mb-2">Quick values</div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 5, 10, 25, 50, 100, 500, 1000].map(v => (
              <button key={v} onClick={() => setInput(String(v))}
                className="bg-gray-800 hover:bg-gray-700 rounded-lg py-2 text-xs font-bold">
                {v} = {doConvert(from, to, String(v), categories)}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 mb-6">
          <div className="text-xs text-gray-400 mb-2">Related converters</div>
          <div className="flex flex-wrap gap-1">
            {sameCat.map(s => (
              <Link key={s} href={`/convert/${s}`}
                className={`text-xs px-2 py-1 rounded ${s===slug?"bg-purple-600":"bg-gray-800 hover:bg-gray-700"}`}>
                {pretty(s.split("-to-")[0])} → {pretty(s.split("-to-")[1])}
              </Link>
            ))}
          </div>
        </div>
        <div className="text-center text-gray-500 text-xs">
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>{" | "}
          <a href="/sol-pay" className="text-purple-400 hover:underline">SOL Pay</a>{" | "}
          <a href="/templates" className="text-purple-400 hover:underline">Templates</a>{" | "}
          <a href="/sniper" className="text-purple-400 hover:underline">Sniper</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
