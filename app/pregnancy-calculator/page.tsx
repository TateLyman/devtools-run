"use client";
import { useState, useMemo } from "react";

export default function PregnancyCalculator() {
  const [lmp, setLmp] = useState("");

  const result = useMemo(() => {
    if (!lmp) return null;
    const lmpDate = new Date(lmp);
    if (isNaN(lmpDate.getTime())) return null;
    const dueDate = new Date(lmpDate);
    dueDate.setDate(dueDate.getDate() + 280);
    const today = new Date();
    const daysSinceLMP = Math.floor((today.getTime() - lmpDate.getTime()) / 86400000);
    const weeks = Math.floor(daysSinceLMP / 7);
    const days = daysSinceLMP % 7;
    const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / 86400000);
    const trimester = weeks < 13 ? 1 : weeks < 27 ? 2 : 3;
    const progress = Math.min(100, (daysSinceLMP / 280) * 100);
    const conception = new Date(lmpDate);
    conception.setDate(conception.getDate() + 14);
    return { dueDate, weeks, days, daysUntilDue, trimester, progress, conception, daysSinceLMP };
  }, [lmp]);

  const fmt = (d: Date) => d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Due Date Calculator</h1>
        <p className="text-[var(--text-secondary)]">Calculate your due date based on last menstrual period. See weeks, trimester, countdown. Free pregnancy due date calculator.</p>
      </div>
      <div className="max-w-md mx-auto space-y-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
          <label className="block text-sm mb-2">First day of last menstrual period (LMP)</label>
          <input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white" />
        </div>
        {result && (
          <>
            <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-6 text-center">
              <p className="text-xs text-gray-400 mb-1">Estimated Due Date</p>
              <p className="text-2xl font-bold text-pink-400">{fmt(result.dueDate)}</p>
              <p className="text-sm text-gray-400 mt-1">{result.daysUntilDue > 0 ? `${result.daysUntilDue} days to go` : "Past due date"}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-white">{result.weeks}w {result.days}d</p>
                <p className="text-xs text-gray-400">Current Week</p>
              </div>
              <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-purple-400">{result.trimester}</p>
                <p className="text-xs text-gray-400">Trimester</p>
              </div>
              <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-emerald-400">{result.progress.toFixed(0)}%</p>
                <p className="text-xs text-gray-400">Complete</p>
              </div>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all" style={{ width: `${result.progress}%` }} />
            </div>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-sm space-y-1">
              <div className="flex justify-between"><span className="text-gray-400">Estimated conception</span><span className="text-white">{fmt(result.conception)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">End of 1st trimester</span><span className="text-white">{fmt(new Date(new Date(lmp).getTime() + 91 * 86400000))}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">End of 2nd trimester</span><span className="text-white">{fmt(new Date(new Date(lmp).getTime() + 189 * 86400000))}</span></div>
            </div>
            <p className="text-[10px] text-gray-600 text-center">This is an estimate based on a 28-day cycle. Consult your healthcare provider for accurate dating.</p>
          </>
        )}
      </div>
    </div>
  );
}
