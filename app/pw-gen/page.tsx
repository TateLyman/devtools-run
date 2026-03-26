"use client";
import { useState } from "react";

function generate(length: number, upper: boolean, lower: boolean, nums: boolean, syms: boolean): string {
  let chars = "";
  if (upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (lower) chars += "abcdefghijklmnopqrstuvwxyz";
  if (nums) chars += "0123456789";
  if (syms) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
  if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, v => chars[v % chars.length]).join("");
}

export default function PwGen() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [nums, setNums] = useState(true);
  const [syms, setSyms] = useState(true);
  const [count, setCount] = useState(1);
  const [passwords, setPasswords] = useState<string[]>([generate(16, true, true, true, true)]);
  const [copied, setCopied] = useState(-1);

  const gen = () => setPasswords(Array.from({ length: count }, () => generate(length, upper, lower, nums, syms)));
  const copy = (pw: string, i: number) => { navigator.clipboard.writeText(pw); setCopied(i); setTimeout(() => setCopied(-1), 800); };
  const copyAll = () => { navigator.clipboard.writeText(passwords.join("\n")); setCopied(-2); setTimeout(() => setCopied(-1), 800); };

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Password Generator</h1>
        <p className="text-[var(--text-secondary)]">Generate strong random passwords</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 space-y-4">
        <div>
          <label className="text-sm text-[var(--text-secondary)]">Length: {length}</label>
          <input type="range" min={4} max={64} value={length} onChange={e => setLength(Number(e.target.value))} className="w-full" />
        </div>
        <div className="flex flex-wrap gap-4">
          {[["Uppercase (A-Z)", upper, setUpper], ["Lowercase (a-z)", lower, setLower], ["Numbers (0-9)", nums, setNums], ["Symbols (!@#$)", syms, setSyms]].map(([label, val, set]) => (
            <label key={label as string} className="text-sm"><input type="checkbox" checked={val as boolean} onChange={e => (set as (v: boolean) => void)(e.target.checked)} className="mr-1" />{label as string}</label>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-[var(--text-secondary)]">Count:</label>
          <select value={count} onChange={e => setCount(Number(e.target.value))} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-sm">
            {[1, 5, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <button onClick={gen} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold">Generate</button>
          {count > 1 && <button onClick={copyAll} className="text-xs text-blue-400">{copied === -2 ? "Copied!" : "Copy All"}</button>}
        </div>
      </div>

      <div className="space-y-2">
        {passwords.map((pw, i) => (
          <div key={i} onClick={() => copy(pw, i)} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 flex justify-between items-center cursor-pointer hover:border-blue-500/50">
            <code className="font-mono text-sm break-all">{pw}</code>
            <span className="text-xs text-blue-400 shrink-0 ml-2">{copied === i ? "Copied!" : "Copy"}</span>
          </div>
        ))}
      </div>

      <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4 text-center text-sm text-blue-400">
        Generated using Web Crypto API (crypto.getRandomValues). Nothing leaves your browser.
      </div>
    </div>
  );
}
