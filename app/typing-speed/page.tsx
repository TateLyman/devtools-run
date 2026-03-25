"use client";
import { useState, useEffect, useRef } from "react";

const texts = [
  "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.",
  "How vexingly quick daft zebras jump. The five boxing wizards jump quickly.",
  "A developer's journey begins with a single line of code and endless cups of coffee.",
  "Success is not final, failure is not fatal. It is the courage to continue that counts.",
  "Programming is not about what you know but about what you can figure out.",
];

export default function TypingSpeed() {
  const [text] = useState(() => texts[Math.floor(Math.random() * texts.length)]);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (value: string) => {
    if (!started) { setStarted(true); setStartTime(Date.now()); }
    setInput(value);
    if (value.length >= text.length) {
      setEndTime(Date.now());
      setDone(true);
    }
  };

  const elapsed = done ? (endTime - startTime) / 1000 : started ? (Date.now() - startTime) / 1000 : 0;
  const words = input.trim().split(/\s+/).filter(Boolean).length;
  const wpm = elapsed > 0 ? Math.round((words / elapsed) * 60) : 0;
  const correct = input.split("").filter((c, i) => c === text[i]).length;
  const accuracy = input.length > 0 ? Math.round((correct / input.length) * 100) : 100;

  const reset = () => { setInput(""); setStarted(false); setDone(false); setStartTime(0); setEndTime(0); inputRef.current?.focus(); };

  // Live timer
  const [, setTick] = useState(0);
  useEffect(() => { if (started && !done) { const t = setInterval(() => setTick((n) => n + 1), 100); return () => clearInterval(t); } }, [started, done]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Typing Speed Test</h1>
        <p className="text-[var(--text-secondary)]">Test your typing speed. See WPM, accuracy, and time. Start typing to begin. Free typing test.</p>
      </div>
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-center">
            <p className="text-3xl font-bold text-purple-400">{wpm}</p>
            <p className="text-xs text-gray-400">WPM</p>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-center">
            <p className={`text-3xl font-bold ${accuracy >= 90 ? "text-emerald-400" : accuracy >= 70 ? "text-yellow-400" : "text-red-400"}`}>{accuracy}%</p>
            <p className="text-xs text-gray-400">Accuracy</p>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 text-center">
            <p className="text-3xl font-bold text-white">{elapsed.toFixed(1)}s</p>
            <p className="text-xs text-gray-400">Time</p>
          </div>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 font-mono text-lg leading-relaxed">
          {text.split("").map((char, i) => (
            <span key={i} className={i < input.length ? (input[i] === char ? "text-emerald-400" : "text-red-400 bg-red-500/20") : i === input.length ? "border-l-2 border-purple-400 text-gray-400" : "text-gray-500"}>{char}</span>
          ))}
        </div>
        <textarea ref={inputRef} value={input} onChange={(e) => !done && handleInput(e.target.value)} placeholder={started ? "" : "Start typing here..."} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-white h-20 resize-none font-mono" autoFocus disabled={done} />
        {done && (
          <div className="text-center space-y-2">
            <p className="text-lg font-bold text-emerald-400">Done! {wpm} WPM at {accuracy}% accuracy</p>
            <button onClick={reset} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold">Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
}
