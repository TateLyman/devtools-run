"use client";
import { useState } from "react";

const BLOCK: Record<string, string[]> = {
  A: ["  █  ","█   █","█████","█   █","█   █"], B: ["████ ","█   █","████ ","█   █","████ "], C: [" ████","█    ","█    ","█    "," ████"],
  D: ["████ ","█   █","█   █","█   █","████ "], E: ["█████","█    ","████ ","█    ","█████"], F: ["█████","█    ","████ ","█    ","█    "],
  G: [" ████","█    ","█  ██","█   █"," ████"], H: ["█   █","█   █","█████","█   █","█   █"], I: ["█████","  █  ","  █  ","  █  ","█████"],
  J: ["█████","    █","    █","█   █"," ███ "], K: ["█   █","█  █ ","███  ","█  █ ","█   █"], L: ["█    ","█    ","█    ","█    ","█████"],
  M: ["█   █","██ ██","█ █ █","█   █","█   █"], N: ["█   █","██  █","█ █ █","█  ██","█   █"], O: [" ███ ","█   █","█   █","█   █"," ███ "],
  P: ["████ ","█   █","████ ","█    ","█    "], Q: [" ███ ","█   █","█ █ █","█  █ "," ██ █"], R: ["████ ","█   █","████ ","█  █ ","█   █"],
  S: [" ████","█    "," ███ ","    █","████ "], T: ["█████","  █  ","  █  ","  █  ","  █  "], U: ["█   █","█   █","█   █","█   █"," ███ "],
  V: ["█   █","█   █","█   █"," █ █ ","  █  "], W: ["█   █","█   █","█ █ █","██ ██","█   █"], X: ["█   █"," █ █ ","  █  "," █ █ ","█   █"],
  Y: ["█   █"," █ █ ","  █  ","  █  ","  █  "], Z: ["█████","   █ ","  █  "," █   ","█████"],
  "0": [" ███ ","█  ██","█ █ █","██  █"," ███ "], "1": ["  █  "," ██  ","  █  ","  █  ","█████"], "2": [" ███ ","█   █","  ██ "," █   ","█████"],
  "3": ["████ ","    █"," ███ ","    █","████ "], "4": ["█   █","█   █","█████","    █","    █"], "5": ["█████","█    ","████ ","    █","████ "],
  "6": [" ███ ","█    ","████ ","█   █"," ███ "], "7": ["█████","    █","   █ ","  █  ","  █  "], "8": [" ███ ","█   █"," ███ ","█   █"," ███ "],
  "9": [" ███ ","█   █"," ████","    █"," ███ "], " ": ["     ","     ","     ","     ","     "],
  "!": ["  █  ","  █  ","  █  ","     ","  █  "], "?": [" ███ ","    █","  █  ","     ","  █  "],
};

export default function AsciiArt() {
  const [text, setText] = useState("HELLO");
  const [char, setChar] = useState("█");

  const lines = Array.from({ length: 5 }, (_, row) =>
    text.toUpperCase().split("").map(c => (BLOCK[c] || BLOCK[" "])[row] || "     ").join(" ")
  );

  const art = lines.map(l => l.replace(/█/g, char)).join("\n");
  const copy = () => navigator.clipboard.writeText(art);

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">ASCII Art Text Generator</h1>
        <p className="text-[var(--text-secondary)]">Convert text to block letter ASCII art</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm text-[var(--text-secondary)] block mb-1">Text</label>
            <input value={text} onChange={e => setText(e.target.value)} maxLength={20} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-lg" placeholder="Type here..." />
          </div>
          <div className="w-24">
            <label className="text-sm text-[var(--text-secondary)] block mb-1">Character</label>
            <select value={char} onChange={e => setChar(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-2 py-2">
              <option value="█">█ Block</option><option value="#"># Hash</option><option value="*">* Star</option>
              <option value="@">@ At</option><option value="0">0 Zero</option><option value="+">+ Plus</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-4 overflow-x-auto">
        <pre className="font-mono text-sm text-emerald-400 whitespace-pre leading-tight">{art}</pre>
      </div>

      <div className="flex justify-center">
        <button onClick={copy} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold">Copy ASCII Art</button>
      </div>
    </div>
  );
}
