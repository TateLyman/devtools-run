"use client";
import { useState, useEffect } from "react";

interface Habit { name: string; streak: number; lastDone: string | null; history: string[] }

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const saved = localStorage.getItem("dt_habits");
    if (saved) setHabits(JSON.parse(saved));
    else setHabits([
      { name: "Exercise", streak: 0, lastDone: null, history: [] },
      { name: "Read 30 min", streak: 0, lastDone: null, history: [] },
      { name: "Meditate", streak: 0, lastDone: null, history: [] },
    ]);
  }, []);

  useEffect(() => { if (habits.length > 0) localStorage.setItem("dt_habits", JSON.stringify(habits)); }, [habits]);

  const addHabit = () => {
    if (!newHabit.trim()) return;
    setHabits([...habits, { name: newHabit.trim(), streak: 0, lastDone: null, history: [] }]);
    setNewHabit("");
  };

  const toggleToday = (i: number) => {
    const copy = [...habits];
    const h = copy[i];
    if (h.lastDone === today) {
      h.history = h.history.filter((d) => d !== today);
      h.lastDone = h.history[h.history.length - 1] || null;
      h.streak = Math.max(0, h.streak - 1);
    } else {
      h.history.push(today);
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      h.streak = h.lastDone === yesterday ? h.streak + 1 : 1;
      h.lastDone = today;
    }
    setHabits(copy);
  };

  const remove = (i: number) => setHabits(habits.filter((_, idx) => idx !== i));

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    return { date: d.toISOString().split("T")[0], label: d.toLocaleDateString("en", { weekday: "short" }).charAt(0) };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Habit Tracker</h1>
        <p className="text-[var(--text-secondary)]">Track daily habits. Build streaks. See your 7-day history. Data saved in your browser. Free habit tracker.</p>
      </div>
      <div className="max-w-lg mx-auto space-y-4">
        <div className="flex gap-2">
          <input value={newHabit} onChange={(e) => setNewHabit(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addHabit()} placeholder="Add a habit..." className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-2.5 text-white" />
          <button onClick={addHabit} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded font-bold">Add</button>
        </div>
        <div className="space-y-2">
          {habits.map((habit, i) => (
            <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleToday(i)} className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${habit.lastDone === today ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-600 hover:border-purple-500"}`}>
                    {habit.lastDone === today && "✓"}
                  </button>
                  <span className={`text-sm font-medium ${habit.lastDone === today ? "text-white" : "text-gray-400"}`}>{habit.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {habit.streak > 0 && <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">🔥 {habit.streak}d</span>}
                  <button onClick={() => remove(i)} className="text-xs text-gray-600 hover:text-red-400">✕</button>
                </div>
              </div>
              <div className="flex gap-1">
                {last7.map((day) => (
                  <div key={day.date} className="flex-1 text-center">
                    <div className={`w-full h-4 rounded-sm ${habit.history.includes(day.date) ? "bg-emerald-500" : "bg-gray-800"}`} />
                    <span className="text-[9px] text-gray-600">{day.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {habits.length === 0 && <p className="text-center text-gray-500 text-sm">No habits yet. Add one above!</p>}
      </div>
    </div>
  );
}
