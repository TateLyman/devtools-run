"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const TEXTS = [
  "The quick brown fox jumps over the lazy dog near the river bank where small fish swim in circles all day long",
  "Programming is the art of telling a computer what to do while hoping it actually listens to your instructions",
  "Every developer knows the feeling of fixing one bug only to discover three more hiding in the shadows of the code",
  "The best way to learn something new is to build a project that uses it in a real and practical way every single day",
  "Coffee and code go together like peanut butter and jelly creating the perfect combination for productive mornings",
  "Open source software has changed the world by allowing millions of developers to collaborate and build amazing tools",
  "The internet is a vast ocean of information where anyone can learn anything if they know where to look and how to search",
  "Building a startup requires patience persistence and the ability to pivot quickly when things do not go according to plan",
];

export default function TypingChallenge() {
  const [text] = useState(() => TEXTS[Math.floor(Math.random() * TEXTS.length)]);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!started || finished) return;
    const t = setInterval(() => setElapsed((Date.now() - startTime) / 1000), 100);
    return () => clearInterval(t);
  }, [started, finished, startTime]);

  const handleInput = useCallback((val: string) => {
    if (!started) { setStarted(true); setStartTime(Date.now()); }
    setInput(val);
    if (val.length >= text.length) {
      setFinished(true);
      setElapsed((Date.now() - (startTime || Date.now())) / 1000);
    }
  }, [started, text, startTime]);

  const words = input.trim().split(/\s+/).filter(Boolean).length;
  const wpm = elapsed > 0 ? Math.round((words / elapsed) * 60) : 0;
  const cpm = elapsed > 0 ? Math.round((input.length / elapsed) * 60) : 0;
  const correct = input.split("").filter((c, i) => c === text[i]).length;
  const accuracy = input.length > 0 ? Math.round((correct / input.length) * 100) : 100;

  const reset = () => { setInput(""); setStarted(false); setFinished(false); setElapsed(0); inputRef.current?.focus(); };

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Typing Speed Test</h1>
        <p className="text-[var(--text-secondary)]">{finished ? "Results" : started ? "Keep typing..." : "Start typing to begin"}</p>
      </section>

      {(started || !finished) && (
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "WPM", value: wpm, color: "text-blue-400" },
            { label: "CPM", value: cpm, color: "text-emerald-400" },
            { label: "Accuracy", value: accuracy + "%", color: accuracy >= 95 ? "text-emerald-400" : accuracy >= 80 ? "text-yellow-400" : "text-red-400" },
            { label: "Time", value: elapsed.toFixed(1) + "s", color: "text-[var(--text-secondary)]" },
          ].map(s => (
            <div key={s.label} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-3 text-center">
              <div className="text-xs text-[var(--text-secondary)]">{s.label}</div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="font-mono text-lg leading-relaxed mb-4">
          {text.split("").map((c, i) => (
            <span key={i} className={i < input.length ? (input[i] === c ? "text-emerald-400" : "text-red-400 bg-red-400/20") : i === input.length ? "border-b-2 border-blue-400" : "text-[var(--text-secondary)]"}>{c}</span>
          ))}
        </div>
        <input ref={inputRef} value={input} onChange={e => handleInput(e.target.value)} disabled={finished} autoFocus
          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-4 py-3 font-mono text-lg" placeholder="Start typing here..." />
      </div>

      {finished && (
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">{wpm} WPM</div>
          <div className="text-sm text-[var(--text-secondary)]">{accuracy}% accuracy | {cpm} CPM | {elapsed.toFixed(1)}s</div>
          <button onClick={reset} className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold">Try Again</button>
        </div>
      )}
    </div>
  );
}
