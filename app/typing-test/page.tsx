"use client";
import { useState, useEffect, useRef } from "react";

const TEXTS = [
  "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump.",
  "In the beginning was the code, and the code was with the developer, and the code was good. Then the developer said let there be functions.",
  "A programmer had a problem and thought I will use regular expressions. Now the programmer had two problems and a headache.",
  "There are only two hard things in computer science: cache invalidation, naming things, and off-by-one errors.",
];

export default function TypingTestPage() {
  const [text] = useState(TEXTS[Math.floor(Math.random() * TEXTS.length)]);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (input.length === 1 && !started) { setStarted(true); setStartTime(Date.now()); }
    if (input.length >= text.length && started && !done) {
      setDone(true);
      const elapsed = (Date.now() - startTime) / 60000;
      const words = text.split(" ").length;
      setWpm(Math.round(words / elapsed));
    }
  }, [input, started, text, startTime, done]);

  const reset = () => { setInput(""); setStarted(false); setDone(false); setWpm(0); inputRef.current?.focus(); };

  const correct = input.split("").filter((c, i) => c === text[i]).length;
  const accuracy = input.length > 0 ? Math.round((correct / input.length) * 100) : 100;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Typing Speed Test</h1>
        <p className="text-gray-400 text-center mb-8">How fast can you type? Start typing to begin.</p>
        {done ? (
          <div className="bg-gray-900 rounded-2xl p-8 text-center mb-6">
            <div className="text-6xl font-extrabold text-purple-400 mb-2">{wpm} WPM</div>
            <div className="text-xl text-gray-400">{accuracy}% accuracy</div>
            <button onClick={reset} className="mt-4 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-bold">Try Again</button>
          </div>
        ) : (
          <>
            <div className="bg-gray-900 rounded-xl p-6 mb-4 font-mono text-lg leading-relaxed">
              {text.split("").map((c, i) => {
                let color = "text-gray-500";
                if (i < input.length) color = input[i] === c ? "text-green-400" : "text-red-400 bg-red-900/30";
                if (i === input.length) color = "text-white bg-purple-600/30";
                return <span key={i} className={color}>{c}</span>;
              })}
            </div>
            <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} autoFocus
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white font-mono resize-none h-20"
              placeholder="Start typing..." />
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>{accuracy}% accuracy</span>
              <span>{input.length}/{text.length} chars</span>
            </div>
          </>
        )}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/pomodoro" className="text-purple-400 hover:underline">Pomodoro</a>{" | "}
          <a href="/word-counter" className="text-purple-400 hover:underline">Word Counter</a>{" | "}
          <a href="/password" className="text-purple-400 hover:underline">Password Gen</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
