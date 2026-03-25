"use client";
import { useState } from "react";

export default function SleepCalculator() {
  const [mode, setMode] = useState<"wake" | "sleep">("wake");
  const [time, setTime] = useState("07:00");

  const cycleDuration = 90; // minutes
  const fallAsleep = 15; // minutes to fall asleep

  const getWakeTimes = (bedtime: string) => {
    const [h, m] = bedtime.split(":").map(Number);
    const bed = new Date(); bed.setHours(h, m + fallAsleep, 0);
    return [4, 5, 6].map((cycles) => {
      const wake = new Date(bed.getTime() + cycles * cycleDuration * 60000);
      return { cycles, time: wake.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }), hours: (cycles * 1.5).toFixed(1) };
    });
  };

  const getBedtimes = (wakeTime: string) => {
    const [h, m] = wakeTime.split(":").map(Number);
    const wake = new Date(); wake.setHours(h, m, 0);
    return [6, 5, 4].map((cycles) => {
      const bed = new Date(wake.getTime() - (cycles * cycleDuration + fallAsleep) * 60000);
      return { cycles, time: bed.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }), hours: (cycles * 1.5).toFixed(1) };
    });
  };

  const results = mode === "wake" ? getBedtimes(time) : getWakeTimes(time);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Sleep Calculator</h1>
        <p className="text-[var(--text-secondary)]">Calculate the best time to sleep or wake up based on 90-minute sleep cycles. Wake up refreshed, not groggy.</p>
      </div>
      <div className="max-w-md mx-auto space-y-4 text-center">
        <div className="flex gap-2 justify-center">
          <button onClick={() => setMode("wake")} className={`px-4 py-2 rounded text-sm ${mode === "wake" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400"}`}>I need to wake up at...</button>
          <button onClick={() => setMode("sleep")} className={`px-4 py-2 rounded text-sm ${mode === "sleep" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400"}`}>I'm going to bed at...</button>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-2">{mode === "wake" ? "I need to wake up at:" : "I'm going to bed at:"}</p>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-6 py-4 text-white text-3xl font-mono text-center" />
        </div>
        <p className="text-sm text-gray-400">{mode === "wake" ? "Go to sleep at one of these times:" : "Set your alarm for:"}</p>
        <div className="space-y-2">
          {results.map((r, i) => (
            <div key={i} className={`rounded-xl p-4 ${i === 0 ? "bg-emerald-600/10 border-2 border-emerald-500/30" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>
              <p className="text-2xl font-bold text-white">{r.time}</p>
              <p className="text-xs text-gray-400">{r.cycles} sleep cycles · {r.hours} hours</p>
              {i === 0 && <p className="text-xs text-emerald-400 mt-1">Recommended</p>}
            </div>
          ))}
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-xs text-[var(--text-secondary)]">
          <p>Based on 90-minute sleep cycles + 15 minutes to fall asleep. Waking between cycles helps you feel refreshed.</p>
          <p className="mt-1">Adults need 7-9 hours of sleep (4-6 cycles).</p>
        </div>
      </div>
    </div>
  );
}
