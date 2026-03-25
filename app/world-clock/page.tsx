"use client";
import { useState, useEffect } from "react";

const timezones = [
  { name: "Los Angeles", tz: "America/Los_Angeles", label: "PT" },
  { name: "Denver", tz: "America/Denver", label: "MT" },
  { name: "Chicago", tz: "America/Chicago", label: "CT" },
  { name: "New York", tz: "America/New_York", label: "ET" },
  { name: "London", tz: "Europe/London", label: "GMT" },
  { name: "Paris", tz: "Europe/Paris", label: "CET" },
  { name: "Berlin", tz: "Europe/Berlin", label: "CET" },
  { name: "Moscow", tz: "Europe/Moscow", label: "MSK" },
  { name: "Dubai", tz: "Asia/Dubai", label: "GST" },
  { name: "Mumbai", tz: "Asia/Kolkata", label: "IST" },
  { name: "Singapore", tz: "Asia/Singapore", label: "SGT" },
  { name: "Shanghai", tz: "Asia/Shanghai", label: "CST" },
  { name: "Tokyo", tz: "Asia/Tokyo", label: "JST" },
  { name: "Seoul", tz: "Asia/Seoul", label: "KST" },
  { name: "Sydney", tz: "Australia/Sydney", label: "AEST" },
  { name: "Auckland", tz: "Pacific/Auckland", label: "NZST" },
  { name: "São Paulo", tz: "America/Sao_Paulo", label: "BRT" },
  { name: "UTC", tz: "UTC", label: "UTC" },
];

export default function WorldClock() {
  const [now, setNow] = useState(new Date());
  const [selected, setSelected] = useState(["America/New_York", "Europe/London", "Asia/Tokyo", "America/Los_Angeles", "Asia/Singapore", "Australia/Sydney"]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTz = (tz: string) => {
    setSelected((prev) => prev.includes(tz) ? prev.filter((t) => t !== tz) : [...prev, tz]);
  };

  const formatTime = (tz: string) => {
    return now.toLocaleTimeString("en-US", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  const formatDate = (tz: string) => {
    return now.toLocaleDateString("en-US", { timeZone: tz, weekday: "short", month: "short", day: "numeric" });
  };

  const getHour = (tz: string) => {
    return parseInt(now.toLocaleTimeString("en-US", { timeZone: tz, hour: "numeric", hour12: false }));
  };

  const getTimeColor = (hour: number) => {
    if (hour >= 6 && hour < 18) return "text-yellow-400"; // Day
    if (hour >= 18 && hour < 22) return "text-orange-400"; // Evening
    return "text-blue-400"; // Night
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">World Clock</h1>
        <p className="text-[var(--text-secondary)]">
          See the current time in cities around the world. Add or remove cities. Day/night indicators. Free online world clock.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {selected.map((tz) => {
          const city = timezones.find((t) => t.tz === tz);
          const hour = getHour(tz);
          return (
            <div key={tz} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 relative">
              <button onClick={() => toggleTz(tz)} className="absolute top-2 right-2 text-xs text-gray-500 hover:text-red-400">✕</button>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-white">{city?.name || tz}</span>
                <span className="text-xs text-gray-500">{city?.label}</span>
              </div>
              <p className={`text-3xl font-mono font-bold ${getTimeColor(hour)}`}>{formatTime(tz)}</p>
              <p className="text-xs text-gray-400 mt-1">{formatDate(tz)} · {hour >= 6 && hour < 18 ? "☀️" : "🌙"}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
        <h3 className="font-bold text-sm mb-2">Add Cities</h3>
        <div className="flex gap-2 flex-wrap">
          {timezones.filter((t) => !selected.includes(t.tz)).map((t) => (
            <button key={t.tz} onClick={() => toggleTz(t.tz)} className="px-3 py-1 rounded text-xs bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-white">{t.name}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
