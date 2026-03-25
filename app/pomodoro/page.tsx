"use client";
import { useState, useEffect, useRef } from "react";

export default function PomodoroPage() {
  const [mins, setMins] = useState(25);
  const [secs, setSecs] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"work"|"break">("work");
  const interval = useRef<any>(null);

  useEffect(() => {
    if (running) {
      interval.current = setInterval(() => {
        setSecs(prev => {
          if (prev === 0) {
            setMins(m => {
              if (m === 0) {
                setRunning(false);
                const next = mode === "work" ? "break" : "work";
                setMode(next);
                setMins(next === "work" ? 25 : 5);
                setSecs(0);
                try { new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ==").play(); } catch {}
                return 0;
              }
              return m - 1;
            });
            return 59;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval.current);
  }, [running, mode]);

  const reset = () => { setRunning(false); setMins(mode === "work" ? 25 : 5); setSecs(0); };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-extrabold mb-2">Pomodoro Timer</h1>
        <p className="text-gray-400 mb-8">25 min work, 5 min break. Stay focused.</p>
        <div className={`text-8xl font-extrabold font-mono mb-4 ${mode === "work" ? "text-red-400" : "text-green-400"}`}>
          {String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}
        </div>
        <div className="text-sm text-gray-400 mb-6 uppercase">{mode === "work" ? "Focus Time" : "Break Time"}</div>
        <div className="flex gap-3 justify-center mb-8">
          <button onClick={() => setRunning(!running)} className={`px-8 py-3 rounded-xl font-bold ${running ? "bg-gray-700" : "bg-purple-600 hover:bg-purple-700"}`}>
            {running ? "Pause" : "Start"}
          </button>
          <button onClick={reset} className="px-6 py-3 rounded-xl font-bold bg-gray-800 hover:bg-gray-700">Reset</button>
        </div>
        <div className="flex gap-2 justify-center">
          {[15, 25, 45, 60].map(m => (
            <button key={m} onClick={() => { setMins(m); setSecs(0); setRunning(false); setMode("work"); }}
              className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded text-xs font-bold">{m}min</button>
          ))}
        </div>
        <div className="mt-12 text-center text-gray-500 text-sm">
          <a href="/daily" className="text-purple-400 hover:underline">Daily Tip</a>{" | "}
          <a href="/word-counter" className="text-purple-400 hover:underline">Word Counter</a>{" | "}
          <a href="/lorem" className="text-purple-400 hover:underline">Lorem Ipsum</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
