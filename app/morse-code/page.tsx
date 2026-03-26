"use client";
import { useState, useCallback } from "react";

const MORSE: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..", J: ".---",
  K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-",
  U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....",
  "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--", "/": "-..-.",
  "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-",
  "+": ".-.-.", "-": "-....-", "_": "..--.-", '"': ".-..-.", "$": "...-..-", "@": ".--.-.",
};
const REVERSE = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

function textToMorse(text: string): string {
  return text.toUpperCase().split("").map(c => c === " " ? "/" : MORSE[c] || "").filter(Boolean).join(" ");
}

function morseToText(morse: string): string {
  return morse.split(" / ").map(word => word.split(" ").map(c => REVERSE[c] || "").join("")).join(" ");
}

export default function MorseCode() {
  const [text, setText] = useState("HELLO WORLD");
  const [morse, setMorse] = useState(() => textToMorse("HELLO WORLD"));
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const handleText = (v: string) => { setText(v); setMorse(textToMorse(v)); };
  const handleMorse = (v: string) => { setMorse(v); setText(morseToText(v)); };

  const playAudio = useCallback(() => {
    const ctx = new AudioContext();
    const dot = 0.06, dash = 0.18, gap = 0.06, letterGap = 0.18, wordGap = 0.42;
    let time = ctx.currentTime;
    morse.split("").forEach(c => {
      if (c === "." || c === "-") {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.frequency.value = 600; osc.connect(gain); gain.connect(ctx.destination);
        osc.start(time); osc.stop(time + (c === "." ? dot : dash));
        time += (c === "." ? dot : dash) + gap;
      } else if (c === " ") { time += letterGap; }
      else if (c === "/") { time += wordGap; }
    });
  }, [morse]);

  const copy = (t: string) => navigator.clipboard.writeText(t);

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Morse Code Translator</h1>
        <p className="text-[var(--text-secondary)]">Convert text to Morse code and back</p>
      </section>

      <div className="flex justify-center gap-2">
        <button onClick={() => setMode("encode")} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === "encode" ? "bg-blue-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>Text → Morse</button>
        <button onClick={() => setMode("decode")} className={`px-4 py-2 rounded-lg text-sm font-bold ${mode === "decode" ? "bg-blue-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>Morse → Text</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold">{mode === "encode" ? "Text" : "Morse Code"}</label>
            <button onClick={() => copy(mode === "encode" ? text : morse)} className="text-xs text-blue-400">Copy</button>
          </div>
          <textarea value={mode === "encode" ? text : morse} onChange={e => mode === "encode" ? handleText(e.target.value) : handleMorse(e.target.value)}
            className="w-full h-32 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none"
            placeholder={mode === "encode" ? "Type text here..." : "Type Morse code (use . and -)"} />
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold">{mode === "encode" ? "Morse Code" : "Text"}</label>
            <button onClick={() => copy(mode === "encode" ? morse : text)} className="text-xs text-blue-400">Copy</button>
          </div>
          <textarea value={mode === "encode" ? morse : text} readOnly
            className="w-full h-32 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-sm resize-none" />
        </div>
      </div>

      <div className="flex justify-center">
        <button onClick={playAudio} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
          🔊 Play Audio
        </button>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-bold text-lg mb-3">Morse Code Reference</h2>
        <div className="grid grid-cols-4 md:grid-cols-9 gap-2 text-center text-sm">
          {Object.entries(MORSE).slice(0, 36).map(([char, code]) => (
            <div key={char} className="bg-[var(--bg-primary)] rounded-lg p-2">
              <div className="font-bold text-lg">{char}</div>
              <div className="text-xs text-[var(--text-secondary)] font-mono">{code}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
