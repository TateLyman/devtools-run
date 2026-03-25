"use client";
import { useState } from "react";

const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const scales = ["", "thousand", "million", "billion", "trillion"];

function numberToWords(num: number): string {
  if (num === 0) return "zero";
  if (num < 0) return "negative " + numberToWords(-num);

  let words = "";
  let scaleIndex = 0;

  while (num > 0) {
    const chunk = num % 1000;
    if (chunk !== 0) {
      let chunkWords = "";
      const h = Math.floor(chunk / 100);
      const t = chunk % 100;
      if (h > 0) chunkWords += ones[h] + " hundred ";
      if (t >= 20) { chunkWords += tens[Math.floor(t / 10)] + " "; if (t % 10 > 0) chunkWords += ones[t % 10] + " "; }
      else if (t > 0) chunkWords += ones[t] + " ";
      words = chunkWords + scales[scaleIndex] + " " + words;
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }
  return words.trim();
}

export default function NumberToWords() {
  const [input, setInput] = useState("42");
  const num = parseInt(input);
  const result = !isNaN(num) && Math.abs(num) <= 999999999999999 ? numberToWords(num) : "Enter a valid number";
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Number to Words Converter</h1>
        <p className="text-[var(--text-secondary)]">Convert numbers to English words. Supports up to trillions. Perfect for checks, legal documents, invoices.</p>
      </div>
      <div className="max-w-lg mx-auto space-y-4 text-center">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter a number..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-white text-2xl font-mono text-center" type="number" />
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
          <p className="text-xl text-emerald-400 capitalize">{result}</p>
        </div>
        <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-bold">{copied ? "Copied!" : "Copy"}</button>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {[100, 1000, 1000000, 999, 12345, 1000000000].map((n) => (
            <button key={n} onClick={() => setInput(String(n))} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-2 hover:border-purple-500/30">
              <span className="text-white font-mono">{n.toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
