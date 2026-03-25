"use client";
import { useState, useRef, useCallback, useEffect } from "react";

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef(0);
  const accumulatedRef = useRef(0);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    accumulatedRef.current = time;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setTime(accumulatedRef.current + (Date.now() - startTimeRef.current));
    }, 10);
  }, [time]);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    accumulatedRef.current = time;
    setRunning(false);
  }, [time]);

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTime(0);
    setRunning(false);
    setLaps([]);
    accumulatedRef.current = 0;
  };

  const lap = () => {
    setLaps((prev) => [time, ...prev]);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  };

  // Timer mode
  const [timerMode, setTimerMode] = useState<"stopwatch" | "timer">("stopwatch");
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [timerDone, setTimerDone] = useState(false);

  const startTimer = () => {
    const total = (timerMinutes * 60 + timerSeconds) * 1000;
    setCountdown(total);
    setTimerDone(false);
    setTimerRunning(true);
    const start = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = total - elapsed;
      if (remaining <= 0) {
        setCountdown(0);
        setTimerRunning(false);
        setTimerDone(true);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setCountdown(remaining);
      }
    }, 50);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerRunning(false);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(0);
    setTimerRunning(false);
    setTimerDone(false);
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Stopwatch & Timer</h1>
        <p className="text-[var(--text-secondary)]">
          Precise stopwatch with lap times and countdown timer. Free online timer tool.
        </p>
      </div>

      <div className="flex gap-2 justify-center">
        <button onClick={() => setTimerMode("stopwatch")} className={`px-4 py-2 rounded text-sm ${timerMode === "stopwatch" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>Stopwatch</button>
        <button onClick={() => setTimerMode("timer")} className={`px-4 py-2 rounded text-sm ${timerMode === "timer" ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>Timer</button>
      </div>

      {timerMode === "stopwatch" ? (
        <div className="max-w-md mx-auto space-y-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-8 text-center">
            <p className="text-6xl font-mono font-bold text-white tracking-wider">{formatTime(time)}</p>
          </div>

          <div className="flex gap-3 justify-center">
            {!running ? (
              <button onClick={start} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold text-lg">{time > 0 ? "Resume" : "Start"}</button>
            ) : (
              <button onClick={stop} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold text-lg">Stop</button>
            )}
            {running && <button onClick={lap} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-full font-bold">Lap</button>}
            {!running && time > 0 && <button onClick={reset} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-full font-bold">Reset</button>}
          </div>

          {laps.length > 0 && (
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
              <h3 className="font-bold text-sm mb-2">Laps</h3>
              <div className="max-h-48 overflow-auto space-y-1">
                {laps.map((lapTime, i) => {
                  const prevLap = laps[i + 1] || 0;
                  const split = lapTime - prevLap;
                  return (
                    <div key={i} className="flex justify-between text-sm font-mono py-1 border-b border-[var(--border)] last:border-0">
                      <span className="text-gray-400">Lap {laps.length - i}</span>
                      <span className="text-purple-400">{formatTime(split)}</span>
                      <span className="text-white">{formatTime(lapTime)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-md mx-auto space-y-4">
          {!timerRunning && !timerDone && countdown === 0 && (
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6 flex gap-4 items-center justify-center">
              <div className="text-center">
                <label className="block text-xs text-gray-400 mb-1">Minutes</label>
                <input type="number" min={0} max={999} value={timerMinutes} onChange={(e) => setTimerMinutes(Number(e.target.value))} className="w-20 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-2xl font-mono text-center" />
              </div>
              <span className="text-2xl text-gray-400 font-bold mt-4">:</span>
              <div className="text-center">
                <label className="block text-xs text-gray-400 mb-1">Seconds</label>
                <input type="number" min={0} max={59} value={timerSeconds} onChange={(e) => setTimerSeconds(Number(e.target.value))} className="w-20 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-2xl font-mono text-center" />
              </div>
            </div>
          )}

          <div className={`bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-8 text-center ${timerDone ? "animate-pulse border-red-500" : ""}`}>
            <p className={`text-6xl font-mono font-bold tracking-wider ${timerDone ? "text-red-400" : "text-white"}`}>
              {timerDone ? "00:00.00" : formatTime(countdown)}
            </p>
            {timerDone && <p className="text-red-400 font-bold mt-2 text-lg">Time's up!</p>}
          </div>

          <div className="flex gap-3 justify-center">
            {!timerRunning && !timerDone && <button onClick={startTimer} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold text-lg">Start</button>}
            {timerRunning && <button onClick={stopTimer} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold text-lg">Pause</button>}
            {(timerDone || countdown > 0) && <button onClick={resetTimer} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-full font-bold">Reset</button>}
          </div>

          <div className="flex gap-2 justify-center flex-wrap">
            {[1, 3, 5, 10, 15, 25, 30, 60].map((m) => (
              <button key={m} onClick={() => { setTimerMinutes(m); setTimerSeconds(0); resetTimer(); }} className="px-3 py-1 rounded text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white">{m} min</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
