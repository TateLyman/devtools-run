"use client";
import { useState, useEffect, useRef } from "react";

export default function MeditationTimer() {
  const [duration, setDuration] = useState(300);
  const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"in" | "hold" | "out">("in");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const breathRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => setRemaining((r) => { if (r <= 1) { setRunning(false); setDone(true); return 0; } return r - 1; }), 1000);
      breathRef.current = setInterval(() => setBreathPhase((p) => p === "in" ? "hold" : p === "hold" ? "out" : "in"), 4000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); if (breathRef.current) clearInterval(breathRef.current); };
  }, [running]);

  const start = () => { setRemaining(duration); setRunning(true); setDone(false); };
  const stop = () => { setRunning(false); if (intervalRef.current) clearInterval(intervalRef.current); };
  const reset = () => { stop(); setRemaining(duration); setDone(false); };

  const min = Math.floor(remaining / 60);
  const sec = remaining % 60;
  const pct = duration > 0 ? ((duration - remaining) / duration) * 100 : 0;

  const presets = [{ label: "1 min", s: 60 }, { label: "3 min", s: 180 }, { label: "5 min", s: 300 }, { label: "10 min", s: 600 }, { label: "15 min", s: 900 }, { label: "20 min", s: 1200 }];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Meditation Timer</h1>
        <p className="text-[var(--text-secondary)]">Simple meditation timer with breathing guide. Choose duration, follow the breath circle. Free mindfulness timer.</p>
      </div>
      <div className="max-w-sm mx-auto space-y-6 text-center">
        {!running && !done && (
          <div className="flex gap-2 justify-center flex-wrap">
            {presets.map((p) => (
              <button key={p.label} onClick={() => { setDuration(p.s); setRemaining(p.s); }} className={`px-4 py-2 rounded-lg text-sm ${duration === p.s ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400"}`}>{p.label}</button>
            ))}
          </div>
        )}
        <div className="relative w-64 h-64 mx-auto">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#2a2a4a" strokeWidth="3" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 45}`} strokeDashoffset={`${2 * Math.PI * 45 * (1 - pct / 100)}`} className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-4xl font-bold font-mono text-white">{String(min).padStart(2, "0")}:{String(sec).padStart(2, "0")}</p>
            {running && (
              <div className={`mt-2 w-12 h-12 rounded-full transition-all duration-[4000ms] ${breathPhase === "in" ? "scale-100 bg-purple-500/30" : breathPhase === "hold" ? "scale-125 bg-purple-500/50" : "scale-75 bg-purple-500/10"}`} />
            )}
            {running && <p className="text-xs text-purple-400 mt-1">Breathe {breathPhase === "in" ? "in..." : breathPhase === "hold" ? "hold..." : "out..."}</p>}
          </div>
        </div>
        {done && <p className="text-xl font-bold text-emerald-400">Session complete! Namaste 🙏</p>}
        <div className="flex gap-3 justify-center">
          {!running ? (
            <button onClick={start} className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-full font-bold text-lg">{done ? "Again" : "Start"}</button>
          ) : (
            <>
              <button onClick={stop} className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold">Pause</button>
              <button onClick={reset} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-full">Reset</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
