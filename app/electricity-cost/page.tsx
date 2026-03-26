"use client";
import { useState } from "react";

const PRESETS = [
  { name: "LED Bulb", watts: 10 }, { name: "Laptop", watts: 65 }, { name: "Desktop PC", watts: 300 },
  { name: "Gaming PC", watts: 500 }, { name: "TV (55 inch)", watts: 80 }, { name: "Refrigerator", watts: 150 },
  { name: "Air Conditioner", watts: 1500 }, { name: "Space Heater", watts: 1500 },
  { name: "Washing Machine", watts: 500 }, { name: "Dryer", watts: 3000 },
  { name: "Microwave", watts: 1000 }, { name: "Hair Dryer", watts: 1800 },
  { name: "Dishwasher", watts: 1800 }, { name: "Electric Oven", watts: 2500 },
  { name: "Phone Charger", watts: 5 }, { name: "WiFi Router", watts: 12 },
];

export default function ElectricityCost() {
  const [watts, setWatts] = useState("100");
  const [hours, setHours] = useState("8");
  const [rate, setRate] = useState("0.12");

  const w = parseFloat(watts) || 0;
  const h = parseFloat(hours) || 0;
  const r = parseFloat(rate) || 0;
  const kwh = (w * h) / 1000;
  const daily = kwh * r;
  const monthly = daily * 30;
  const yearly = daily * 365;

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Electricity Cost Calculator</h1>
        <p className="text-[var(--text-secondary)]">How much does it cost to run your appliances?</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm text-[var(--text-secondary)] block mb-1">Power (Watts)</label>
            <input value={watts} onChange={e => setWatts(e.target.value)} type="number" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono" />
          </div>
          <div>
            <label className="text-sm text-[var(--text-secondary)] block mb-1">Hours per Day</label>
            <input value={hours} onChange={e => setHours(e.target.value)} type="number" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono" />
          </div>
          <div>
            <label className="text-sm text-[var(--text-secondary)] block mb-1">Rate ($/kWh)</label>
            <input value={rate} onChange={e => setRate(e.target.value)} type="number" step="0.01" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "kWh/Day", value: kwh.toFixed(2) },
          { label: "Daily Cost", value: "$" + daily.toFixed(2) },
          { label: "Monthly Cost", value: "$" + monthly.toFixed(2) },
          { label: "Yearly Cost", value: "$" + yearly.toFixed(2) },
        ].map(c => (
          <div key={c.label} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center">
            <div className="text-xs text-[var(--text-secondary)]">{c.label}</div>
            <div className="text-2xl font-bold text-emerald-400">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-3">Common Appliances</h2>
        <div className="grid gap-2 md:grid-cols-4">
          {PRESETS.map(p => (
            <button key={p.name} onClick={() => setWatts(p.watts.toString())}
              className={`text-left bg-[var(--bg-primary)] rounded-lg px-3 py-2 text-sm border hover:border-blue-500/50 ${parseInt(watts) === p.watts ? "border-blue-500" : "border-transparent"}`}>
              <span className="font-bold">{p.name}</span>
              <span className="text-[var(--text-secondary)] ml-1">{p.watts}W</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
