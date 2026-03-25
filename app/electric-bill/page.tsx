"use client";
import { useState } from "react";

export default function ElectricBill() {
  const [watts, setWatts] = useState(1000);
  const [hours, setHours] = useState(8);
  const [days, setDays] = useState(30);
  const [rate, setRate] = useState(0.12);

  const kWh = (watts * hours * days) / 1000;
  const cost = kWh * rate;
  const daily = cost / days;
  const yearly = cost * 12;

  const presets = [
    { name: "LED Bulb", watts: 10 }, { name: "Laptop", watts: 65 }, { name: "Desktop PC", watts: 300 },
    { name: "TV", watts: 100 }, { name: "Fridge", watts: 150 }, { name: "AC Unit", watts: 1500 },
    { name: "Space Heater", watts: 1500 }, { name: "Washing Machine", watts: 500 },
    { name: "Microwave", watts: 1000 }, { name: "Gaming PC", watts: 600 },
    { name: "Hair Dryer", watts: 1800 }, { name: "Crypto Mining Rig", watts: 3000 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Electricity Cost Calculator</h1>
        <p className="text-[var(--text-secondary)]">Calculate how much an appliance costs to run. Watts, hours, rate. See daily, monthly, yearly cost. Free electricity calculator.</p>
      </div>
      <div className="max-w-lg mx-auto space-y-4">
        <div className="flex gap-2 flex-wrap">
          {presets.map((p) => (
            <button key={p.name} onClick={() => setWatts(p.watts)} className={`px-2 py-1 rounded text-[10px] ${watts === p.watts ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400 hover:text-white"}`}>{p.name} ({p.watts}W)</button>
          ))}
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
          <div><div className="flex justify-between text-sm mb-1"><label>Power</label><span className="text-white font-mono">{watts}W</span></div><input type="range" min={1} max={5000} value={watts} onChange={(e) => setWatts(Number(e.target.value))} className="w-full accent-purple-500" /></div>
          <div><div className="flex justify-between text-sm mb-1"><label>Hours per day</label><span className="text-white font-mono">{hours}h</span></div><input type="range" min={0.5} max={24} step={0.5} value={hours} onChange={(e) => setHours(Number(e.target.value))} className="w-full accent-purple-500" /></div>
          <div><div className="flex justify-between text-sm mb-1"><label>Days</label><span className="text-white font-mono">{days}</span></div><input type="range" min={1} max={365} value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-full accent-purple-500" /></div>
          <div><div className="flex justify-between text-sm mb-1"><label>Rate ($/kWh)</label><span className="text-white font-mono">${rate}</span></div><input type="range" min={0.01} max={0.50} step={0.01} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-purple-500" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-center"><p className="text-xs text-gray-400">Energy Used</p><p className="text-xl font-bold text-white">{kWh.toFixed(1)} kWh</p></div>
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-3 text-center"><p className="text-xs text-purple-400">Monthly Cost</p><p className="text-xl font-bold text-purple-400">${cost.toFixed(2)}</p></div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-center"><p className="text-xs text-gray-400">Daily Cost</p><p className="text-lg font-bold text-white">${daily.toFixed(2)}</p></div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-center"><p className="text-xs text-gray-400">Yearly Cost</p><p className="text-lg font-bold text-yellow-400">${yearly.toFixed(2)}</p></div>
        </div>
      </div>
    </div>
  );
}
