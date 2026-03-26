"use client";
import { useState, useEffect } from "react";

function getRemaining(target: Date): { days: number; hours: number; minutes: number; seconds: number; total: number } {
  const total = target.getTime() - Date.now();
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  return {
    days: Math.floor(total / 86400000),
    hours: Math.floor((total % 86400000) / 3600000),
    minutes: Math.floor((total % 3600000) / 60000),
    seconds: Math.floor((total % 60000) / 1000),
    total,
  };
}

const PRESETS = [
  { name: "New Year 2027", date: "2027-01-01T00:00:00" },
  { name: "Halloween 2026", date: "2026-10-31T00:00:00" },
  { name: "Christmas 2026", date: "2026-12-25T00:00:00" },
  { name: "Summer Solstice", date: "2026-06-21T00:00:00" },
];

export default function CountdownTo() {
  const [target, setTarget] = useState("2027-01-01T00:00");
  const [label, setLabel] = useState("New Year 2027");
  const [remaining, setRemaining] = useState(getRemaining(new Date("2027-01-01")));

  useEffect(() => {
    const t = setInterval(() => setRemaining(getRemaining(new Date(target))), 1000);
    return () => clearInterval(t);
  }, [target]);

  const Box = ({ value, label: l }: { value: number; label: string }) => (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 md:p-6 text-center min-w-[80px]">
      <div className="text-4xl md:text-6xl font-bold font-mono text-blue-400">{String(value).padStart(2, "0")}</div>
      <div className="text-xs text-[var(--text-secondary)] mt-1 uppercase">{l}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Countdown Timer</h1>
        <p className="text-[var(--text-secondary)]">{label ? `Counting down to ${label}` : "Set a date to count down to"}</p>
      </section>

      <div className="flex justify-center gap-2 md:gap-4 flex-wrap">
        <Box value={remaining.days} label="Days" />
        <Box value={remaining.hours} label="Hours" />
        <Box value={remaining.minutes} label="Minutes" />
        <Box value={remaining.seconds} label="Seconds" />
      </div>

      {remaining.total <= 0 && target && <div className="text-center text-3xl font-bold text-emerald-400">Time's up!</div>}

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 space-y-3">
        <div>
          <label className="text-sm text-[var(--text-secondary)] block mb-1">Event Name</label>
          <input value={label} onChange={e => setLabel(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2" placeholder="My event..." />
        </div>
        <div>
          <label className="text-sm text-[var(--text-secondary)] block mb-1">Target Date & Time</label>
          <input type="datetime-local" value={target} onChange={e => setTarget(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono" />
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <h2 className="text-sm font-bold mb-2">Quick Presets</h2>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button key={p.name} onClick={() => { setTarget(p.date.replace("T", "T").slice(0, 16)); setLabel(p.name); }}
              className="bg-[var(--bg-primary)] border border-[var(--border)] px-3 py-1 rounded text-sm hover:border-blue-500/50">{p.name}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
