"use client";
import { useState } from "react";

function analyze(pw: string) {
  const len = pw.length;
  let charset = 0;
  if (/[a-z]/.test(pw)) charset += 26;
  if (/[A-Z]/.test(pw)) charset += 26;
  if (/[0-9]/.test(pw)) charset += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) charset += 33;
  const entropy = len * Math.log2(charset || 1);
  const guesses = Math.pow(2, entropy);
  const seconds = guesses / 1e10;
  
  let timeStr = "";
  if (seconds < 1) timeStr = "Instant";
  else if (seconds < 60) timeStr = Math.ceil(seconds) + " seconds";
  else if (seconds < 3600) timeStr = Math.ceil(seconds / 60) + " minutes";
  else if (seconds < 86400) timeStr = Math.ceil(seconds / 3600) + " hours";
  else if (seconds < 31536000) timeStr = Math.ceil(seconds / 86400) + " days";
  else if (seconds < 31536000 * 1000) timeStr = Math.ceil(seconds / 31536000) + " years";
  else if (seconds < 31536000 * 1e6) timeStr = Math.ceil(seconds / 31536000 / 1000) + "K years";
  else if (seconds < 31536000 * 1e9) timeStr = Math.ceil(seconds / 31536000 / 1e6) + "M years";
  else timeStr = "Centuries+";

  let score = 0;
  if (len >= 8) score++;
  if (len >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  
  const labels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"];

  const checks = [
    { label: "At least 8 characters", pass: len >= 8 },
    { label: "At least 12 characters", pass: len >= 12 },
    { label: "Uppercase letters", pass: /[A-Z]/.test(pw) },
    { label: "Lowercase letters", pass: /[a-z]/.test(pw) },
    { label: "Numbers", pass: /[0-9]/.test(pw) },
    { label: "Special characters", pass: /[^a-zA-Z0-9]/.test(pw) },
    { label: "No common patterns", pass: !/^(123|abc|qwe|pass|1234)/i.test(pw) },
  ];

  return { entropy: entropy.toFixed(1), timeStr, score: Math.min(score, 4), label: labels[Math.min(score, 4)], color: colors[Math.min(score, 4)], checks, charset, len };
}

export default function PasswordStrength() {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const r = analyze(pw);

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Password Strength Checker</h1>
        <p className="text-[var(--text-secondary)]">Check how strong your password is. Nothing leaves your browser.</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="relative">
          <input value={pw} onChange={e => setPw(e.target.value)} type={show ? "text" : "password"} placeholder="Enter password to check..."
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-4 py-3 font-mono text-lg pr-20" autoComplete="off" />
          <button onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-400">{show ? "Hide" : "Show"}</button>
        </div>
        {pw && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span style={{ color: r.color }} className="font-bold">{r.label}</span>
              <span className="text-[var(--text-secondary)]">{r.entropy} bits entropy</span>
            </div>
            <div className="w-full bg-[var(--bg-primary)] rounded-full h-3">
              <div className="h-3 rounded-full transition-all" style={{ width: `${(r.score + 1) * 20}%`, backgroundColor: r.color }} />
            </div>
          </div>
        )}
      </div>

      {pw && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center">
              <div className="text-xs text-[var(--text-secondary)]">Time to Crack</div>
              <div className="text-xl font-bold" style={{ color: r.color }}>{r.timeStr}</div>
              <div className="text-xs text-[var(--text-secondary)]">at 10B guesses/sec</div>
            </div>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center">
              <div className="text-xs text-[var(--text-secondary)]">Length</div>
              <div className="text-xl font-bold">{r.len} chars</div>
            </div>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center">
              <div className="text-xs text-[var(--text-secondary)]">Character Set</div>
              <div className="text-xl font-bold">{r.charset} chars</div>
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
            <h2 className="font-bold text-lg mb-3">Requirements</h2>
            <div className="space-y-2">
              {r.checks.map(c => (
                <div key={c.label} className="flex items-center gap-2 text-sm">
                  <span className={c.pass ? "text-emerald-400" : "text-red-400"}>{c.pass ? "✓" : "✗"}</span>
                  <span className={c.pass ? "text-[var(--text-secondary)]" : ""}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4 text-center text-sm text-blue-400">
        Your password is checked entirely in your browser. It is never sent to any server.
      </div>
    </div>
  );
}
