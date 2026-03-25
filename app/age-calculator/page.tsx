"use client";
import { useState, useMemo } from "react";

export default function AgeCalculator() {
  const today = new Date();
  const [birthDate, setBirthDate] = useState("");

  const result = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return null;

    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    // Next birthday
    const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= now) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Day of week born
    const dayOfWeek = birth.toLocaleDateString("en-US", { weekday: "long" });

    // Zodiac
    const zodiacSigns = [
      { sign: "Capricorn", start: [12, 22], end: [1, 19] },
      { sign: "Aquarius", start: [1, 20], end: [2, 18] },
      { sign: "Pisces", start: [2, 19], end: [3, 20] },
      { sign: "Aries", start: [3, 21], end: [4, 19] },
      { sign: "Taurus", start: [4, 20], end: [5, 20] },
      { sign: "Gemini", start: [5, 21], end: [6, 20] },
      { sign: "Cancer", start: [6, 21], end: [7, 22] },
      { sign: "Leo", start: [7, 23], end: [8, 22] },
      { sign: "Virgo", start: [8, 23], end: [9, 22] },
      { sign: "Libra", start: [9, 23], end: [10, 22] },
      { sign: "Scorpio", start: [10, 23], end: [11, 21] },
      { sign: "Sagittarius", start: [11, 22], end: [12, 21] },
    ];
    const bMonth = birth.getMonth() + 1;
    const bDay = birth.getDate();
    const zodiac = zodiacSigns.find((z) => {
      if (z.start[0] === 12 && z.end[0] === 1) {
        return (bMonth === 12 && bDay >= z.start[1]) || (bMonth === 1 && bDay <= z.end[1]);
      }
      return (bMonth === z.start[0] && bDay >= z.start[1]) || (bMonth === z.end[0] && bDay <= z.end[1]);
    })?.sign || "Unknown";

    return { years, months, days, totalDays, totalWeeks, totalMonths, totalHours, totalMinutes, daysUntilBirthday, dayOfWeek, zodiac };
  }, [birthDate]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Age Calculator</h1>
        <p className="text-[var(--text-secondary)]">
          Calculate your exact age in years, months, days. See total days lived, days until next birthday, zodiac sign, and more.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6">
          <label className="block text-sm mb-2">Date of Birth</label>
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-4 py-3 text-white text-lg" />
        </div>

        {result && (
          <>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-6 text-center">
              <p className="text-xs text-gray-400 mb-2">Your Age</p>
              <div className="flex items-center justify-center gap-4">
                <div>
                  <p className="text-4xl font-bold text-purple-400">{result.years}</p>
                  <p className="text-xs text-gray-400">years</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-purple-400">{result.months}</p>
                  <p className="text-xs text-gray-400">months</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-purple-400">{result.days}</p>
                  <p className="text-xs text-gray-400">days</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Days", value: result.totalDays.toLocaleString() },
                { label: "Total Weeks", value: result.totalWeeks.toLocaleString() },
                { label: "Total Months", value: result.totalMonths.toLocaleString() },
                { label: "Total Hours", value: result.totalHours.toLocaleString() },
                { label: "Total Minutes", value: result.totalMinutes.toLocaleString() },
                { label: "Next Birthday", value: `${result.daysUntilBirthday} days` },
              ].map((s) => (
                <div key={s.label} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-white">{s.value}</p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 flex justify-between text-sm">
              <span className="text-gray-400">Born on: <span className="text-white">{result.dayOfWeek}</span></span>
              <span className="text-gray-400">Zodiac: <span className="text-purple-400">{result.zodiac}</span></span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
