"use client";
import { useState, useEffect, useRef } from "react";

export default function FocusTimer() {
  const [workMin, setWorkMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) {
          try { audioRef.current?.play(); } catch {}
          if (isBreak) {
            setIsBreak(false);
            setSessions(s => s + 1);
            return workMin * 60;
          } else {
            setIsBreak(true);
            return breakMin * 60;
          }
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, isBreak, workMin, breakMin]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const total = isBreak ? breakMin * 60 : workMin * 60;
  const pct = ((total - timeLeft) / total) * 100;

  const reset = () => { setRunning(false); setIsBreak(false); setTimeLeft(workMin * 60); };

  return (
    <div className="space-y-6">
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQoGAACBhYqF" preload="auto" />
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Focus Timer</h1>
        <p className="text-[var(--text-secondary)]">{isBreak ? "Break time! Relax." : "Stay focused. You got this."}</p>
      </section>

      <div className="flex justify-center">
        <div className="relative w-64 h-64">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border)" strokeWidth="3" />
            <circle cx="50" cy="50" r="45" fill="none" stroke={isBreak ? "#22c55e" : "#3b82f6"} strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 45}`} strokeDashoffset={`${2 * Math.PI * 45 * (1 - pct / 100)}`}
              strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold font-mono">{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</div>
            <div className={`text-sm font-bold mt-1 ${isBreak ? "text-emerald-400" : "text-blue-400"}`}>{isBreak ? "BREAK" : "FOCUS"}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button onClick={() => setRunning(!running)} className={`px-8 py-3 rounded-lg font-bold text-lg ${running ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}>
          {running ? "Pause" : "Start"}
        </button>
        <button onClick={reset} className="bg-[var(--bg-secondary)] border border-[var(--border)] px-6 py-3 rounded-lg font-bold hover:bg-[var(--bg-primary)]">Reset</button>
      </div>

      <div className="text-center text-sm text-[var(--text-secondary)]">Sessions completed: <strong className="text-white">{sessions}</strong></div>

      {!running && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-[var(--text-secondary)]">Work: {workMin} min</label>
              <input type="range" min={5} max={60} step={5} value={workMin} onChange={e => { setWorkMin(Number(e.target.value)); if (!isBreak) setTimeLeft(Number(e.target.value) * 60); }} className="w-full" />
            </div>
            <div>
              <label className="text-sm text-[var(--text-secondary)]">Break: {breakMin} min</label>
              <input type="range" min={1} max={30} step={1} value={breakMin} onChange={e => { setBreakMin(Number(e.target.value)); if (isBreak) setTimeLeft(Number(e.target.value) * 60); }} className="w-full" />
            </div>
          </div>
          <div className="flex gap-2 mt-3 justify-center">
            {[[25, 5, "Classic"], [50, 10, "Long"], [15, 3, "Quick"]].map(([w, b, name]) => (
              <button key={name as string} onClick={() => { setWorkMin(w as number); setBreakMin(b as number); setTimeLeft((w as number) * 60); setIsBreak(false); }}
                className="bg-[var(--bg-primary)] border border-[var(--border)] px-3 py-1 rounded text-sm hover:border-blue-500/50">{name as string} ({w}/{b})</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
