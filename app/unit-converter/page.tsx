"use client";
import { useState, useMemo } from "react";

const categories: Record<string, { units: Record<string, number>; base: string }> = {
  length: {
    base: "meter",
    units: { millimeter: 0.001, centimeter: 0.01, meter: 1, kilometer: 1000, inch: 0.0254, foot: 0.3048, yard: 0.9144, mile: 1609.344 },
  },
  weight: {
    base: "kilogram",
    units: { milligram: 0.000001, gram: 0.001, kilogram: 1, "metric ton": 1000, ounce: 0.028349523, pound: 0.45359237, stone: 6.35029318 },
  },
  temperature: { base: "celsius", units: { celsius: 1, fahrenheit: 1, kelvin: 1 } },
  area: {
    base: "sqm",
    units: { "sq millimeter": 0.000001, "sq centimeter": 0.0001, "sq meter": 1, hectare: 10000, "sq kilometer": 1000000, "sq inch": 0.00064516, "sq foot": 0.09290304, acre: 4046.8564224, "sq mile": 2589988.110336 },
  },
  volume: {
    base: "liter",
    units: { milliliter: 0.001, liter: 1, "cubic meter": 1000, gallon: 3.78541, quart: 0.946353, pint: 0.473176, cup: 0.236588, "fluid ounce": 0.0295735, tablespoon: 0.0147868, teaspoon: 0.00492892 },
  },
  speed: {
    base: "m/s",
    units: { "m/s": 1, "km/h": 0.277778, "mph": 0.44704, knot: 0.514444, "ft/s": 0.3048 },
  },
  data: {
    base: "byte",
    units: { bit: 0.125, byte: 1, kilobyte: 1024, megabyte: 1048576, gigabyte: 1073741824, terabyte: 1099511627776 },
  },
  time: {
    base: "second",
    units: { millisecond: 0.001, second: 1, minute: 60, hour: 3600, day: 86400, week: 604800, month: 2629746, year: 31556952 },
  },
};

function convert(value: number, from: string, to: string, category: string): number {
  if (category === "temperature") {
    // Special handling for temperature
    let celsius: number;
    if (from === "celsius") celsius = value;
    else if (from === "fahrenheit") celsius = (value - 32) * 5 / 9;
    else celsius = value - 273.15; // kelvin

    if (to === "celsius") return celsius;
    if (to === "fahrenheit") return celsius * 9 / 5 + 32;
    return celsius + 273.15; // kelvin
  }

  const cat = categories[category];
  const fromFactor = cat.units[from];
  const toFactor = cat.units[to];
  return (value * fromFactor) / toFactor;
}

export default function UnitConverter() {
  const [category, setCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("meter");
  const [toUnit, setToUnit] = useState("foot");
  const [value, setValue] = useState("1");

  const units = Object.keys(categories[category].units);

  const result = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return "";
    return convert(num, fromUnit, toUnit, category);
  }, [value, fromUnit, toUnit, category]);

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Unit Converter</h1>
        <p className="text-[var(--text-secondary)]">
          Convert between units of length, weight, temperature, area, volume, speed, data, and time. Free online unit converter.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        {Object.keys(categories).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              const u = Object.keys(categories[cat].units);
              setFromUnit(u[0]);
              setToUnit(u[1] || u[0]);
            }}
            className={`px-3 py-1.5 rounded text-sm capitalize ${category === cat ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">From</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-lg font-mono"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm capitalize"
              >
                {units.map((u) => <option key={u} value={u} className="capitalize">{u}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <button onClick={swap} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-full w-10 h-10 flex items-center justify-center text-purple-400 hover:text-white">
              ↕
            </button>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">To</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-emerald-400 text-lg font-mono">
                {result !== "" ? (typeof result === "number" ? result.toLocaleString("en-US", { maximumFractionDigits: 8 }) : result) : "—"}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm capitalize"
              >
                {units.map((u) => <option key={u} value={u} className="capitalize">{u}</option>)}
              </select>
            </div>
          </div>
        </div>

        {value && !isNaN(parseFloat(value)) && (
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <h3 className="font-bold text-sm mb-2">All Conversions</h3>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {units.map((u) => {
                const val = convert(parseFloat(value), fromUnit, u, category);
                return (
                  <div key={u} className="flex justify-between py-1 px-2 rounded hover:bg-[var(--bg-primary)]">
                    <span className="text-gray-400 capitalize">{u}</span>
                    <span className="text-white font-mono">{val.toLocaleString("en-US", { maximumFractionDigits: 6 })}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
