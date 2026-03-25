"use client";
import { useState, useMemo } from "react";

const zones = [
  { label: "UTC", tz: "UTC" },
  { label: "US Eastern (ET)", tz: "America/New_York" },
  { label: "US Central (CT)", tz: "America/Chicago" },
  { label: "US Mountain (MT)", tz: "America/Denver" },
  { label: "US Pacific (PT)", tz: "America/Los_Angeles" },
  { label: "London (GMT/BST)", tz: "Europe/London" },
  { label: "Paris (CET)", tz: "Europe/Paris" },
  { label: "Berlin (CET)", tz: "Europe/Berlin" },
  { label: "Moscow (MSK)", tz: "Europe/Moscow" },
  { label: "Dubai (GST)", tz: "Asia/Dubai" },
  { label: "Mumbai (IST)", tz: "Asia/Kolkata" },
  { label: "Singapore (SGT)", tz: "Asia/Singapore" },
  { label: "Shanghai (CST)", tz: "Asia/Shanghai" },
  { label: "Tokyo (JST)", tz: "Asia/Tokyo" },
  { label: "Seoul (KST)", tz: "Asia/Seoul" },
  { label: "Sydney (AEST)", tz: "Australia/Sydney" },
  { label: "Auckland (NZST)", tz: "Pacific/Auckland" },
  { label: "São Paulo (BRT)", tz: "America/Sao_Paulo" },
  { label: "Hawaii (HST)", tz: "Pacific/Honolulu" },
  { label: "Alaska (AKST)", tz: "America/Anchorage" },
];

export default function TimezoneConverter() {
  const now = new Date();
  const [fromTz, setFromTz] = useState("America/New_York");
  const [toTz, setToTz] = useState("Europe/London");
  const [date, setDate] = useState(now.toISOString().split("T")[0]);
  const [time, setTime] = useState(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }).slice(0, 5));

  const converted = useMemo(() => {
    try {
      // Create a date in the source timezone
      const dateStr = `${date}T${time}:00`;
      const sourceDate = new Date(dateStr);

      // Get the offset difference
      const fromFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: fromTz,
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        hour12: false,
      });
      const toFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: toTz,
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        hour12: false,
      });

      // Parse source timezone parts to find offset
      const sourceParts = fromFormatter.formatToParts(sourceDate);
      const destParts = toFormatter.formatToParts(sourceDate);

      const getVal = (parts: Intl.DateTimeFormatPart[], type: string) =>
        parts.find((p) => p.type === type)?.value || "";

      const destTime = `${getVal(destParts, "hour")}:${getVal(destParts, "minute")}`;
      const destDate = `${getVal(destParts, "month")}/${getVal(destParts, "day")}/${getVal(destParts, "year")}`;
      const destDay = new Date(sourceDate).toLocaleDateString("en-US", { timeZone: toTz, weekday: "long" });

      return { time: destTime, date: destDate, day: destDay };
    } catch {
      return null;
    }
  }, [fromTz, toTz, date, time]);

  const swap = () => {
    setFromTz(toTz);
    setToTz(fromTz);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Timezone Converter</h1>
        <p className="text-[var(--text-secondary)]">
          Convert time between 20 time zones worldwide. See the equivalent time instantly. Free online timezone converter.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">From</label>
            <select value={fromTz} onChange={(e) => setFromTz(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm">
              {zones.map((z) => <option key={z.tz} value={z.tz}>{z.label}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
            </div>
          </div>

          <div className="flex justify-center">
            <button onClick={swap} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-full w-10 h-10 flex items-center justify-center text-purple-400 hover:text-white">↕</button>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">To</label>
            <select value={toTz} onChange={(e) => setToTz(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm">
              {zones.map((z) => <option key={z.tz} value={z.tz}>{z.label}</option>)}
            </select>
          </div>
        </div>

        {converted && (
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-6 text-center">
            <p className="text-4xl font-bold font-mono text-purple-400">{converted.time}</p>
            <p className="text-sm text-gray-400 mt-2">{converted.day}, {converted.date}</p>
          </div>
        )}

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
          <h3 className="font-bold text-sm mb-2">All Time Zones</h3>
          <div className="max-h-48 overflow-auto space-y-1 text-xs">
            {zones.map((z) => {
              const fmt = new Date().toLocaleTimeString("en-US", { timeZone: z.tz, hour: "2-digit", minute: "2-digit" });
              return (
                <div key={z.tz} className="flex justify-between py-0.5">
                  <span className="text-gray-400">{z.label}</span>
                  <span className="text-white font-mono">{fmt}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
