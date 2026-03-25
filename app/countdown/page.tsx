"use client";
import { useState, useEffect, useMemo } from "react";

export default function Countdown() {
  const [targetDate, setTargetDate] = useState("");
  const [eventName, setEventName] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const diff = useMemo(() => {
    if (!targetDate) return null;
    const target = new Date(targetDate).getTime();
    const remaining = target - now;
    if (remaining <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds, passed: false };
  }, [targetDate, now]);

  const presets = [
    { label: "New Year", date: `${new Date().getFullYear() + 1}-01-01` },
    { label: "Christmas", date: `${new Date().getMonth() >= 11 && new Date().getDate() > 25 ? new Date().getFullYear() + 1 : new Date().getFullYear()}-12-25` },
    { label: "Halloween", date: `${new Date().getMonth() >= 10 && new Date().getDate() > 31 ? new Date().getFullYear() + 1 : new Date().getFullYear()}-10-31` },
    { label: "+30 days", date: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0] },
    { label: "+90 days", date: new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0] },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Countdown Timer</h1>
        <p className="text-[var(--text-secondary)]">
          Count down to any date. See days, hours, minutes, and seconds remaining. Presets for holidays and milestones.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
          <input
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Event name (optional)"
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm"
          />
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white"
          />
          <div className="flex gap-2 flex-wrap">
            {presets.map((p) => (
              <button key={p.label} onClick={() => { setTargetDate(p.date); if (!eventName) setEventName(p.label); }} className="px-3 py-1 rounded text-xs bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-white">{p.label}</button>
            ))}
          </div>
        </div>

        {diff && (
          <div className={`bg-[var(--bg-secondary)] border ${diff.passed ? "border-emerald-500/30" : "border-[var(--border)]"} rounded-lg p-8 text-center`}>
            {eventName && <p className="text-lg font-bold text-white mb-4">{eventName}</p>}
            {diff.passed ? (
              <p className="text-3xl font-bold text-emerald-400">Event has arrived!</p>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {[
                  { value: diff.days, label: "Days" },
                  { value: diff.hours, label: "Hours" },
                  { value: diff.minutes, label: "Minutes" },
                  { value: diff.seconds, label: "Seconds" },
                ].map((d) => (
                  <div key={d.label}>
                    <p className="text-4xl sm:text-5xl font-bold font-mono text-purple-400">{String(d.value).padStart(2, "0")}</p>
                    <p className="text-xs text-gray-400 mt-1">{d.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
