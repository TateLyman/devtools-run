"use client";
import { useState } from "react";

export default function DateCalculator() {
  const today = new Date().toISOString().split("T")[0];
  const [date1, setDate1] = useState(today);
  const [date2, setDate2] = useState("");
  const [addDays, setAddDays] = useState(30);
  const [mode, setMode] = useState<"between" | "add" | "subtract">("between");

  // Days between two dates
  const daysBetween = (() => {
    if (!date1 || !date2) return null;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diff = Math.abs(d2.getTime() - d1.getTime());
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.abs((d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth()));
    const years = Math.abs(d2.getFullYear() - d1.getFullYear());
    return { days, weeks, months, years, hours: days * 24, minutes: days * 24 * 60 };
  })();

  // Add/subtract days
  const resultDate = (() => {
    if (!date1) return null;
    const d = new Date(date1);
    d.setDate(d.getDate() + (mode === "subtract" ? -addDays : addDays));
    return d;
  })();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Date Calculator</h1>
        <p className="text-[var(--text-secondary)]">
          Calculate days between dates, add or subtract days from a date. See results in days, weeks, months, years.
        </p>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setMode("between")} className={`px-4 py-2 rounded text-sm ${mode === "between" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>Days Between</button>
        <button onClick={() => setMode("add")} className={`px-4 py-2 rounded text-sm ${mode === "add" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>Add Days</button>
        <button onClick={() => setMode("subtract")} className={`px-4 py-2 rounded text-sm ${mode === "subtract" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>Subtract Days</button>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        {mode === "between" ? (
          <>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm mb-1">Start Date</label>
                <input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm mb-1">End Date</label>
                <input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white" />
              </div>
            </div>

            {daysBetween && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Days", value: daysBetween.days.toLocaleString() },
                  { label: "Weeks", value: daysBetween.weeks.toLocaleString() },
                  { label: "Months", value: daysBetween.months.toLocaleString() },
                  { label: "Years", value: daysBetween.years.toLocaleString() },
                  { label: "Hours", value: daysBetween.hours.toLocaleString() },
                  { label: "Minutes", value: daysBetween.minutes.toLocaleString() },
                ].map((s) => (
                  <div key={s.label} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-purple-400">{s.value}</p>
                    <p className="text-xs text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm mb-1">Start Date</label>
                <input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm mb-1">{mode === "add" ? "Add" : "Subtract"} Days</label>
                <input type="number" value={addDays} onChange={(e) => setAddDays(Number(e.target.value))} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white font-mono" min={0} />
              </div>
              <div className="flex gap-2 flex-wrap">
                {[7, 14, 30, 60, 90, 180, 365].map((d) => (
                  <button key={d} onClick={() => setAddDays(d)} className="px-2 py-1 rounded text-xs bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-white">{d} days</button>
                ))}
              </div>
            </div>

            {resultDate && (
              <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-6 text-center">
                <p className="text-xs text-gray-400 mb-1">Result Date</p>
                <p className="text-3xl font-bold text-purple-400">{resultDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
