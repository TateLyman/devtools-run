"use client";
import { useState, useCallback } from "react";

function generatePassword(length: number, options: { uppercase: boolean; lowercase: boolean; numbers: boolean; symbols: boolean }): string {
  let chars = "";
  if (options.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (options.lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
  if (options.numbers) chars += "0123456789";
  if (options.symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
  if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (n) => chars[n % chars.length]).join("");
}

function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;

  if (score <= 2) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 4) return { score, label: "Medium", color: "bg-yellow-500" };
  return { score, label: "Strong", color: "bg-emerald-500" };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(20);
  const [options, setOptions] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: true });
  const [password, setPassword] = useState(() => generatePassword(20, { uppercase: true, lowercase: true, numbers: true, symbols: true }));
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const generate = useCallback(() => {
    const pw = generatePassword(length, options);
    setPassword(pw);
    setHistory((h) => [pw, ...h].slice(0, 10));
  }, [length, options]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = getStrength(password);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Password Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate strong, random passwords. Customize length and character types. Cryptographically secure. Free password generator online.
        </p>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6">
        <div className="flex items-center gap-3">
          <code className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-4 py-3 text-lg font-mono text-white select-all break-all">{password}</code>
          <button onClick={handleCopy} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded font-bold whitespace-nowrap">{copied ? "Copied!" : "Copy"}</button>
          <button onClick={generate} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded whitespace-nowrap">New</button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
            <div className={`h-full ${strength.color} transition-all`} style={{ width: `${(strength.score / 6) * 100}%` }} />
          </div>
          <span className="text-xs font-bold" style={{ color: strength.color.replace("bg-", "").includes("red") ? "#ef4444" : strength.color.includes("yellow") ? "#eab308" : "#10b981" }}>{strength.label}</span>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-4">
        <div>
          <label className="block text-sm mb-1">Length: {length}</label>
          <input type="range" min={4} max={128} value={length} onChange={(e) => { setLength(Number(e.target.value)); }} className="w-full accent-purple-500" />
          <div className="flex justify-between text-xs text-gray-500"><span>4</span><span>128</span></div>
        </div>

        <div className="flex flex-wrap gap-4">
          {Object.entries(options).map(([key, val]) => (
            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={val} onChange={() => setOptions({ ...options, [key]: !val })} className="accent-purple-500" />
              <span className="capitalize">{key}</span>
              <span className="text-xs text-gray-500">
                {key === "uppercase" ? "A-Z" : key === "lowercase" ? "a-z" : key === "numbers" ? "0-9" : "!@#$%"}
              </span>
            </label>
          ))}
        </div>

        <button onClick={generate} className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded font-bold text-lg">
          Generate Password
        </button>
      </div>

      {history.length > 1 && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
          <h3 className="font-bold text-sm mb-2">Recent Passwords</h3>
          {history.slice(1).map((pw, i) => (
            <div key={i} className="flex items-center justify-between py-1 border-b border-[var(--border)] last:border-0">
              <code className="text-xs font-mono text-gray-400 truncate">{pw}</code>
              <button onClick={() => { navigator.clipboard.writeText(pw); }} className="text-xs text-purple-400 hover:text-purple-300 ml-2">Copy</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
