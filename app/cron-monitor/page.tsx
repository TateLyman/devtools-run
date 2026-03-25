"use client";
import { useState } from "react";

const EXPRESSIONS: [string, string][] = [
  ["* * * * *", "Every minute"],
  ["0 * * * *", "Every hour"],
  ["0 0 * * *", "Every day at midnight"],
  ["0 9 * * 1-5", "Weekdays at 9 AM"],
  ["0 0 * * 0", "Every Sunday at midnight"],
  ["*/5 * * * *", "Every 5 minutes"],
  ["0 */6 * * *", "Every 6 hours"],
  ["0 0 1 * *", "First day of every month"],
  ["0 0 1 1 *", "Every January 1st"],
  ["30 4 * * *", "Every day at 4:30 AM"],
];

export default function CronMonitorPage() {
  const [expr, setExpr] = useState("*/5 * * * *");
  const parts = expr.split(" ");
  const labels = ["Minute (0-59)", "Hour (0-23)", "Day of Month (1-31)", "Month (1-12)", "Day of Week (0-6)"];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Cron Expression Explained</h1>
        <p className="text-gray-400 text-center mb-8">Understand and build cron expressions visually.</p>
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <input type="text" value={expr} onChange={e=>setExpr(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-2xl text-center mb-4" />
          <div className="grid grid-cols-5 gap-2 text-center">
            {parts.slice(0, 5).map((p, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-3">
                <div className="text-xl font-bold text-purple-400 font-mono">{p}</div>
                <div className="text-[10px] text-gray-400 mt-1">{labels[i]}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-2">Common expressions (click to use)</div>
          <div className="space-y-1">
            {EXPRESSIONS.map(([e, d], i) => (
              <button key={i} onClick={()=>setExpr(e)} className="flex justify-between w-full px-3 py-2 rounded hover:bg-gray-800 text-left">
                <code className="text-sm text-green-400 font-mono">{e}</code>
                <span className="text-xs text-gray-400">{d}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/cron" className="text-purple-400 hover:underline">Cron Generator</a>{" | "}
          <a href="/uptime" className="text-purple-400 hover:underline">Uptime Monitor</a>{" | "}
          <a href="/epoch" className="text-purple-400 hover:underline">Epoch</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
